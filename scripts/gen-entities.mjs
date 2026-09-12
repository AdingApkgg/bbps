#!/usr/bin/env node
/**
 * 从游戏自带 CSV 生成实体表。
 *
 *   node scripts/gen-entities.mjs              # 只报告（含与当前 UI 的差异）
 *   node scripts/gen-entities.mjs --write      # 写 src/lib/generated/entities.ts
 *   node scripts/gen-entities.mjs --check      # 与已提交文件不一致就退出 1
 *   node scripts/gen-entities.mjs --csv <dir>  # 默认 ../bb/HorsebeachServer/Gamefiles/csv
 *
 * ── 为什么这些规则是这样的（都对着服务端源码核过，不是猜的）──
 *
 * 1. 只认 Gamefiles/csv/。Files/LogicDataTables.cs 里的 CSVFilePathDictionary
 *    把路径写死了；同仓库的 csv_v60（124 行）和 csv_addcoc_test（152 行）
 *    根本不加载，拿错目录会让所有序号整体错位。
 *
 * 2. 实例序号 = 具名行的序号。Supercell 的 CSV 里空 Name 行是上一行的续行，
 *    不占序号。Files/Table.cs 比的是未 trim 的空串，所以这里也不能 trim。
 *
 * 3. 文本是三层叠加：texts.csv → texts_patch.csv → Config/texts_server.csv，
 *    LogicDataTables.cs:97 用 Texts[tid] = ... 覆盖，后来者赢。
 *    （实测这两个补丁文件目前只改功能开关和 HBCheat 提示语，没碰实体名，
 *      但照着服务端实现写，省得哪天加了一条就悄悄不一致。）
 *
 * 4. 名称三级回退，且每行都记来源：
 *      override  —— src/data/entity-name-overrides.json 里的手写名
 *      tid       —— 官方本地化（TID 唯一且非占位）
 *      csv-name  —— 退到 CSV 内部英文名，会在报告里单列出来催补
 *    必须有 override 这一级：characters.csv 里 Walker/Sergeant/DroneBat/
 *    SuperRifleman 全写 TID_RIFLEMAN，只按官方名会塌成四个「步枪手」。
 *
 * 5. exposed 标记保留「当前 UI 实际提供了哪些 ID」。CSV 里有 251 个建筑、
 *    191 个技能，而站点只放了 149 / 34 —— 哪些该露出来是人工知识，
 *    过去只隐含在 commands.json 的行集合里，这里把它显式化。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const argv = process.argv.slice(2)
const write = argv.includes('--write')
const check = argv.includes('--check')
const csvIdx = argv.indexOf('--csv')
const CSV =
  csvIdx > -1 ? argv[csvIdx + 1] : join(__dirname, '../../bb/HorsebeachServer/Gamefiles/csv')
const SERVER_CFG = join(CSV, '../../Config')
const OUT = join(ROOT, 'src/lib/generated/entities.ts')
const OVERRIDES = join(ROOT, 'src/data/entity-name-overrides.json')

if (!existsSync(join(CSV, 'texts.csv'))) {
  console.error(`找不到 CSV 目录：${CSV}\n用 --csv <路径> 指定服务端 Gamefiles/csv`)
  process.exit(check ? 0 : 1) // CI 上没有服务端仓库，--check 静默放过
}

/* ── CSV 解析 ── */
function parseCSV(text) {
  const rows = []
  let row = [],
    field = '',
    q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else q = false
      } else field += c
    } else if (c === '"') q = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (c !== '\r') field += c
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows
}
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16)
const load = (f) => parseCSV(readFileSync(join(CSV, f), 'utf8'))

/* ── 文本表：三层叠加，后来者覆盖 ── */
const TEXTS = new Map()
let LANG_I = { en: 1, zh: 8 }
{
  const base = load('texts.csv')
  const h = base[0]
  LANG_I = { en: h.indexOf('EN'), zh: h.indexOf('ZH-HANS') }
  const layers = [base]
  const patch = join(CSV, 'texts_patch.csv')
  if (existsSync(patch)) layers.push(parseCSV(readFileSync(patch, 'utf8')))
  const srv = join(SERVER_CFG, 'texts_server.csv')
  if (existsSync(srv)) layers.push(parseCSV(readFileSync(srv, 'utf8')))
  for (const rows of layers) {
    for (const r of rows) {
      const tid = r[0]
      if (!tid || tid === 'TID' || tid === 'string') continue
      TEXTS.set(tid, { en: r[LANG_I.en] ?? '', zh: r[LANG_I.zh] ?? '' })
    }
  }
}

const PLACEHOLDER_TIDS = new Set(['TID_UNUSED', 'TID_TODO', 'TID_PLACEHOLDER', ''])
const overrides = existsSync(OVERRIDES) ? JSON.parse(readFileSync(OVERRIDES, 'utf8')) : {}

/** 一张表：具名行 → { index, raw, tid } */
function readTable(file) {
  const rows = load(file)
  const h = rows[0]
  const ni = h.indexOf('Name')
  const ti = h.indexOf('TID')
  const tidCount = new Map()
  for (const r of rows.slice(2)) {
    if (!r || r[ni] === undefined || r[ni] === '') continue
    tidCount.set(r[ti], (tidCount.get(r[ti]) ?? 0) + 1)
  }
  const out = []
  let idx = -1
  for (const r of rows.slice(2)) {
    if (!r || r[ni] === undefined || r[ni] === '') continue
    idx++
    out.push({ index: idx, raw: r[ni], tid: r[ti], tidShared: tidCount.get(r[ti]) > 1 })
  }
  return out
}

/** 名称三级回退 */
function resolveName(tableId, value, row) {
  const ov = overrides[`${tableId}:${value}`]
  if (ov) return { zh: ov.zh, en: ov.en ?? ov.zh, source: 'override' }
  if (!PLACEHOLDER_TIDS.has(row.tid) && !row.tidShared && /^TID_/.test(row.tid)) {
    const t = TEXTS.get(row.tid)
    if (t && (t.zh || t.en)) {
      return { zh: t.zh || t.en, en: t.en || t.zh, source: 'tid' }
    }
  }
  return { zh: row.raw, en: row.raw, source: 'csv-name' }
}

/* ── 表定义 ──
   idKind: global = 类型*1e6+序号（/place、/setboat）
           instance = 裸序号（/resource、/spell、/engraving）
           slug = 字符串取值（/layout）                             */
const SPECS = [
  { id: 'building', file: 'buildings.csv', type: 1, idKind: 'global', zh: '建筑', en: 'Building' },
  {
    id: 'resource',
    file: 'resources.csv',
    type: 3,
    idKind: 'instance',
    zh: '资源',
    en: 'Resource'
  },
  { id: 'troop', file: 'characters.csv', type: 4, idKind: 'global', zh: '部队', en: 'Troop' },
  {
    id: 'obstacle',
    file: 'obstacles.csv',
    type: 8,
    idKind: 'global',
    zh: '障碍物',
    en: 'Obstacle'
  },
  { id: 'trap', file: 'traps.csv', type: 12, idKind: 'global', zh: '地雷', en: 'Trap' },
  { id: 'deco', file: 'decos.csv', type: 18, idKind: 'global', zh: '装饰', en: 'Decoration' },
  {
    id: 'spell',
    file: 'spells.csv',
    type: 26,
    idKind: 'instance',
    zh: '母舰技能',
    en: 'Warship ability'
  },
  {
    id: 'engraving',
    file: 'artifact_epics.csv',
    type: 74,
    idKind: 'instance',
    zh: '雕刻',
    en: 'Engraving'
  }
]

/* ── 哪些取值提供给用户 ──
   CSV 里有 251 个建筑、191 个母舰技能，站点只放其中 149 / 34 个 ——
   剩下的是内部条目。这个集合是人工知识，过去只隐含在 commands.json 的
   行集合里，现在显式存成一份清单。没有清单就全部放出来，会一下子多出
   102 个建筑和 157 个技能。 */
const exposed = {}
{
  const p = join(ROOT, 'src/data/exposed-entities.json')
  if (existsSync(p)) {
    for (const [k, list] of Object.entries(JSON.parse(readFileSync(p, 'utf8')))) {
      exposed[k] = new Set(list)
    }
  } else {
    console.warn('⚠ 找不到 exposed-entities.json，将把 CSV 里所有条目都标为暴露')
  }
}

/* ── 生成 ── */
const tables = []
const stats = []
for (const spec of SPECS) {
  const rows = readTable(spec.file)
  const options = rows.map((r) => {
    const value = spec.idKind === 'global' ? String(spec.type * 1000000 + r.index) : String(r.index)
    const n = resolveName(spec.id, value, r)
    const ex = exposed[spec.id]
    const same = (a) => String(Number(a)) === String(Number(value))
    return {
      value,
      zh: n.zh,
      en: n.en,
      source: n.source,
      raw: r.raw,
      exposed: ex ? [...ex].some(same) : true
    }
  })
  const by = { override: 0, tid: 0, 'csv-name': 0 }
  for (const o of options) by[o.source]++
  const exCount = options.filter((o) => o.exposed).length
  // 比对前去掉前导零：commands.json 写的是 /spell add 00，表里是 '0'，
  // int.TryParse 两者等价，不能当成「CSV 里没有」
  const norm = (v) => String(Number(v))
  const have = new Set(options.map((o) => norm(o.value)))
  const uiOnly = exposed[spec.id] ? [...exposed[spec.id]].filter((v) => !have.has(norm(v))) : []
  tables.push({ ...spec, options })
  stats.push({ id: spec.id, total: options.length, exposed: exCount, by, uiOnly })
}

/* layout：不是实体表，名字挂在 TID_LAYOUT_<取值> 上 */
const LAYOUT_VALUES = [
  'playerbase',
  'enemybase',
  'small_a',
  'small_b',
  'mainland_a',
  'mainland_b',
  'med_a',
  'factory',
  'harbor',
  'octobase',
  'turtlebase',
  'warship'
]
const layoutOptions = LAYOUT_VALUES.map((v) => {
  const t = TEXTS.get(`TID_LAYOUT_${v.toUpperCase()}`)
  if (!t) {
    console.error(`✗ layout ${v} 没有 TID_LAYOUT_${v.toUpperCase()}`)
    process.exit(1)
  }
  return { value: v, zh: t.zh, en: t.en, source: 'tid', raw: v, exposed: true }
})
tables.push({
  id: 'layout',
  idKind: 'slug',
  zh: '岛屿阵型',
  en: 'Base layout',
  options: layoutOptions
})
stats.push({
  id: 'layout',
  total: 12,
  exposed: 12,
  by: { override: 0, tid: 12, 'csv-name': 0 },
  uiOnly: []
})

/* ── 报告 ── */
console.log(`CSV: ${CSV}\n`)
console.log('表          总数  UI暴露   官方名  手写覆盖  仅内部名')
for (const s of stats) {
  console.log(
    `  ${s.id.padEnd(10)}${String(s.total).padStart(4)}${String(s.exposed).padStart(7)}` +
      `${String(s.by.tid).padStart(8)}${String(s.by.override).padStart(9)}${String(s.by['csv-name']).padStart(9)}`
  )
}
const orphaned = stats.filter((s) => s.uiOnly.length)
if (orphaned.length) {
  console.log('\n✗ UI 里有、CSV 里没有的取值（服务端会拒绝，属于坏行）：')
  for (const s of orphaned) {
    console.log(
      `  ${s.id}: ${s.uiOnly.length} 个 —— ${s.uiOnly.slice(0, 6).join(', ')}${s.uiOnly.length > 6 ? ' …' : ''}`
    )
  }
}
const needName = stats.filter((s) => s.by['csv-name'] > 0)
if (needName.length) {
  console.log('\n· 仅有内部英文名、建议在 entity-name-overrides.json 里补中文：')
  for (const s of needName) console.log(`  ${s.id}: ${s.by['csv-name']} 个`)
}

/* ── 输出文件 ── */
const hashes = ['texts.csv', ...SPECS.map((s) => s.file)]
  .map((f) => `//   ${f} sha256:${sha(join(CSV, f))}`)
  .join('\n')
const body = tables
  .map(
    (t) =>
      `  ${t.id}: {\n` +
      `    id: '${t.id}',\n` +
      `    labelZh: ${JSON.stringify(t.zh)},\n` +
      `    labelEn: ${JSON.stringify(t.en)},\n` +
      `    idKind: '${t.idKind}',\n` +
      `    options: [\n` +
      t.options
        .map(
          (o) =>
            `      { value: ${JSON.stringify(o.value)}, zh: ${JSON.stringify(o.zh)}, en: ${JSON.stringify(o.en)}, source: '${o.source}', exposed: ${o.exposed} }`
        )
        .join(',\n') +
      `\n    ]\n  }`
  )
  .join(',\n')

const generated =
  `// 由 scripts/gen-entities.mjs 从游戏自带 CSV 生成，勿手改。\n` +
  `// 改名请改 src/data/entity-name-overrides.json 后重新生成。\n` +
  `//\n// 数据来源指纹：\n${hashes}\n\n` +
  `/** 名称来源：override=手写覆盖，tid=游戏官方本地化，csv-name=未本地化的内部名 */\n` +
  `export type NameSource = 'override' | 'tid' | 'csv-name'\n\n` +
  `export interface Entity {\n` +
  `  /** 指令里实际填的取值，永远是字符串（母舰技能有 '00' 这种前导零） */\n` +
  `  value: string\n  zh: string\n  en: string\n  source: NameSource\n` +
  `  /** 站点是否把这个取值提供给用户；CSV 里有很多内部条目不该露出来 */\n` +
  `  exposed: boolean\n}\n\n` +
  `export interface EntityTable {\n  id: string\n  labelZh: string\n  labelEn: string\n` +
  `  /** global=类型*1e6+序号，instance=裸序号，slug=字符串 */\n` +
  `  idKind: 'global' | 'instance' | 'slug'\n  options: Entity[]\n}\n\n` +
  `export const ENTITY_TABLES: Record<string, EntityTable> = {\n${body}\n}\n\n` +
  `export function entityTable(id: string): EntityTable | null {\n` +
  `  return ENTITY_TABLES[id] ?? null\n}\n`

if (check) {
  const same = existsSync(OUT) && readFileSync(OUT, 'utf8') === generated
  console.log(same ? '\n与已提交文件一致' : '\n✗ 与已提交的 entities.ts 不一致，跑 --write')
  process.exit(same ? 0 : 1)
}
if (!write) {
  console.log('\n(dry-run，未写入；加 --write 生效)')
  process.exit(0)
}
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, generated)
console.log(`\n已写入 ${OUT}`)
