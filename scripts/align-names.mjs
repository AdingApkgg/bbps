#!/usr/bin/env node
/**
 * 用游戏自带本地化对齐 src/data/commands.json 里的实体名称。
 *
 *   node scripts/align-names.mjs [--write] [--csv <路径>]
 *
 * 真值来源是服务端仓库的 Gamefiles/csv：各实体表的 TID 列 → texts.csv 的
 * EN / ZH-HANS 列。commands.json 里的中文名是手写的，实测大量与游戏不符
 * （layout 12 条错 5 条、资源 3 与 4 直接颠倒），故一律以 CSV 为准。
 *
 * 默认从 ../bb 找 CSV，没有就跳过并提示。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const write = process.argv.includes('--write')
const csvArgIdx = process.argv.indexOf('--csv')
const CSV_DIR = csvArgIdx > -1
  ? process.argv[csvArgIdx + 1]
  : join(__dirname, '../../bb/HorsebeachServer/Gamefiles/csv')

if (!existsSync(join(CSV_DIR, 'texts.csv'))) {
  console.error(`找不到 CSV 目录：${CSV_DIR}\n用 --csv <路径> 指定服务端 Gamefiles/csv`)
  process.exit(1)
}

/* ── 极简 CSV 解析（字段可能带引号与逗号） ── */
function parseCSV(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const load = (f) => parseCSV(readFileSync(join(CSV_DIR, f), 'utf8'))

/* ── texts.csv：TID → { en, zh } ── */
const texts = load('texts.csv')
const th = texts[0]
const TID_I = th.indexOf('TID'), EN_I = th.indexOf('EN'), ZH_I = th.indexOf('ZH-HANS')
const TEXTS = new Map()
for (const r of texts) {
  if (r[TID_I]) TEXTS.set(r[TID_I], { en: r[EN_I], zh: r[ZH_I] })
}

/**
 * 实例序号只数具名行 —— Supercell 的 CSV 里空 Name 行是上一行的续行。
 */
/** 明显是占位、不能当名字用的 TID */
const PLACEHOLDER_TIDS = new Set(['TID_UNUSED', 'TID_TODO', ''])

function buildTable(file) {
  const rows = load(file)
  const h = rows[0]
  const ni = h.indexOf('Name'), ti = h.indexOf('TID')

  // 先统计每个 TID 被多少行共用：CSV 里存在 Walker / Sergeant / DroneBat /
  // SuperRifleman 全写 TID_RIFLEMAN 这种情况，此时官方名无法区分这些行，
  // 反而不如 commands.json 里手写的名字，故这类一律跳过。
  const tidCount = new Map()
  for (const r of rows.slice(2)) {
    if (!r || !(r[ni] || '').trim()) continue
    tidCount.set(r[ti], (tidCount.get(r[ti]) ?? 0) + 1)
  }

  const out = new Map()
  let idx = -1
  for (const r of rows.slice(2)) {
    if (!r || !(r[ni] || '').trim()) continue
    idx++
    const tid = r[ti]
    if (PLACEHOLDER_TIDS.has(tid) || tidCount.get(tid) > 1) continue
    const t = TEXTS.get(tid)
    if (t && (t.zh || t.en)) out.set(idx, { ...t, raw: r[ni] })
  }
  return out
}

// LogicDataType：1 BUILDING / 3 RESOURCE / 4 CHARACTER / 8 OBSTACLE / 12 TRAP / 18 DECO / 26 SPELL
const BY_TYPE = {
  1: buildTable('buildings.csv'),
  3: buildTable('resources.csv'),
  4: buildTable('characters.csv'),
  8: buildTable('obstacles.csv'),
  12: buildTable('traps.csv'),
  18: buildTable('decos.csv'),
  26: buildTable('spells.csv')
}
const ENGRAVINGS = buildTable('artifact_epics.csv')

/** 从指令里认出「这条讲的是哪个实体」 */
function resolve(command) {
  let m
  if ((m = command.match(/^\/place\s+\d+\s+\d+\s+(\d+)(?:\s+\d+)?\s*$/))) {
    const gid = Number(m[1])
    return BY_TYPE[Math.floor(gid / 1000000)]?.get(gid % 1000000)
  }
  if ((m = command.match(/^\/setboat\s+\d+\s+(\d+)\s+\d+\s*$/))) {
    const gid = Number(m[1])
    return BY_TYPE[Math.floor(gid / 1000000)]?.get(gid % 1000000)
  }
  if ((m = command.match(/^\/spell\s+add\s+(\d+)\s*$/))) return BY_TYPE[26]?.get(Number(m[1]))
  if ((m = command.match(/^\/engraving\s+(?:level|quality)\s+(\d+)\s+\d+\s*$/))) {
    return ENGRAVINGS.get(Number(m[1]))
  }
  if ((m = command.match(/^\/resource\s+(\d+)\s+\d+\s*$/))) return BY_TYPE[3]?.get(Number(m[1]))
  return null
}

/** 官方显示名：中文(英文)，与现有 commands.json 的写法一致 */
const officialName = (t) =>
  t.zh && t.en && t.zh !== t.en ? `${t.zh}(${t.en})` : (t.zh || t.en)

const FILE = join(__dirname, '../src/data/commands.json')
const data = JSON.parse(readFileSync(FILE, 'utf8'))

const byFamily = {}
const famOf = (c) =>
  /^\/place \d+ \d+ \d+ \d+/.test(c) ? '/place 建筑'
  : /^\/place \d+ \d+ \d+$/.test(c) ? '/place 装饰·障碍·陷阱'
  : /^\/setboat/.test(c) ? '/setboat 部队'
  : /^\/spell add/.test(c) ? '/spell 战舰技能'
  : /^\/engraving/.test(c) ? '/engraving 雕刻'
  : /^\/resource/.test(c) ? '/resource 资源' : '其他'
let matched = 0, changed = 0, unmatched = 0
const samples = []
for (const cmd of data.commands) {
  const t = resolve(cmd.command)
  if (!t) { unmatched++; continue }
  matched++
  const next = officialName(t)
  if (next !== cmd.name) {
    changed++
    if (samples.length < 25) samples.push({ c: cmd.command, from: cmd.name, to: next })
    byFamily[famOf(cmd.command)] = (byFamily[famOf(cmd.command)] ?? 0) + 1
    cmd.name = next
  }
}

console.log(`可识别实体的条目：${matched}（其中名称需更正 ${changed}）`)
console.log(`无法识别（非实体类指令）：${unmatched}`)
console.log()
console.log('按族分布：')
for (const [k, v] of Object.entries(byFamily).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(24)}${v} 条`)
}
console.log()
for (const s of samples) {
  console.log(`  ${s.c}`)
  console.log(`    ${s.from}`)
  console.log(`    → ${s.to}`)
}
if (changed > samples.length) console.log(`  …另有 ${changed - samples.length} 条`)

if (write) {
  writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log('\n已写入 src/data/commands.json')
} else {
  console.log('\n(dry-run，未写入；加 --write 生效)')
}
