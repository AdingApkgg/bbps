#!/usr/bin/env node
/**
 * 指令说明（散文）的编译与校验。
 *
 *   node scripts/gen-command-notes.mjs             # 只报告
 *   node scripts/gen-command-notes.mjs --write     # 写 src/lib/generated/command-notes.ts
 *   node scripts/gen-command-notes.mjs --check     # 不一致就退出 1，供 pre-push / CI 用
 *   node scripts/gen-command-notes.mjs --seed      # 从 COMMAND_CATALOG 的 desc 初始化 md（只做一次）
 *
 * 分工：
 *   src/content/command-notes.zh.md  —— 给人看的说明，AI 可以随便改
 *   src/lib/commands.ts              —— 语法、参数、danger、admin、advancedOnly
 *
 * 为什么要编译成 .ts：站点是 output:'export' 的静态导出，指令页是 'use client'，
 * 运行时读不到 .md，必须在构建前编译进 bundle。
 *
 * 为什么标记不能写进 md：danger/admin 是安全闸门，得由类型系统和脚本校验。
 * 散文里写「这条很危险」不会让按钮多要一次确认，只有 commands.ts 里的
 * danger:'destructive' 才会。所以本脚本会拒绝把这些词写进 md（见 CONTRABAND）。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MD = join(ROOT, 'src/content/command-notes.zh.md')
const OUT = join(ROOT, 'src/lib/generated/command-notes.ts')

const argv = process.argv.slice(2)
const write = argv.includes('--write')
const check = argv.includes('--check')
const seed = argv.includes('--seed')

/* ── 取目录：用 bun 跑一小段 TS，避免在 .mjs 里手写 TS 解析 ── */
function loadCatalog() {
  const probe = join(ROOT, '.gen-catalog-probe.ts')
  writeFileSync(
    probe,
    `import { COMMAND_CATALOG } from './src/lib/commands'\n` +
      `console.log(JSON.stringify(COMMAND_CATALOG.map((c) => ({ cmd: c.cmd, desc: c.desc, danger: c.danger ?? null }))))\n`
  )
  try {
    const out = execFileSync('bun', ['run', probe], { cwd: ROOT, encoding: 'utf8' })
    return JSON.parse(out.trim().split('\n').pop())
  } finally {
    try { execFileSync('rm', ['-f', probe]) } catch { /* ignore */ }
  }
}

const catalog = loadCatalog()
const byCmd = new Map(catalog.map((c) => [c.cmd, c]))

/* ── seed：把现有 desc 倒进 md ── */
if (seed) {
  const lines = [
    '<!--',
    '  指令说明。只写「这条是干什么的、什么时候用、有什么坑」。',
    '',
    '  不要写进来的东西（脚本会报错）：',
    '    · 指令语法与参数占位符 —— 在 src/lib/commands.ts 的 syntax',
    '    · danger / admin / advancedOnly 等标记 —— 那是安全闸门，必须机器可校验',
    '',
    '  二级标题必须与 COMMAND_CATALOG 的 cmd 完全一致，多了少了都会报错。',
    '  跑 node scripts/gen-command-notes.mjs --check 校验。',
    '-->',
    ''
  ]
  for (const c of catalog) {
    lines.push(`## ${c.cmd}`, '', (c.desc || '').trim() || '（说明待补充）', '')
  }
  if (!write) {
    console.log(`(dry-run) 将写入 ${MD}，${catalog.length} 条`)
    process.exit(0)
  }
  mkdirSync(dirname(MD), { recursive: true })
  writeFileSync(MD, lines.join('\n'))
  console.log(`已写入 ${MD}（${catalog.length} 条）`)
  process.exit(0)
}

if (!existsSync(MD)) {
  console.error(`找不到 ${MD}\n先跑 node scripts/gen-command-notes.mjs --seed --write`)
  process.exit(1)
}

/* ── 解析 md ── */
const raw = readFileSync(MD, 'utf8')
const notes = new Map()
let cur = null
let buf = []
const flush = () => {
  if (cur !== null) notes.set(cur, buf.join('\n').trim())
  buf = []
}
for (const line of raw.split('\n')) {
  const m = line.match(/^##\s+(\S.*?)\s*$/)
  if (m) { flush(); cur = m[1]; continue }
  if (cur !== null) buf.push(line)
}
flush()

/* ── 校验 ── */
// 散文里不该出现的东西：语法行、危险标记
const CONTRABAND = /\b(danger|destructive|advancedOnly|queryOnly|inGameOnly)\b|^```/m

const orphans = [...notes.keys()].filter((k) => !byCmd.has(k))
const missing = catalog.filter((c) => !notes.has(c.cmd) || !notes.get(c.cmd))
const missingDangerous = missing.filter((c) => c.danger)
const contraband = [...notes.entries()].filter(([, v]) => CONTRABAND.test(v))

console.log(`目录 ${catalog.length} 条 · md ${notes.size} 条`)
if (orphans.length) {
  console.log(`\n✗ md 里有 ${orphans.length} 个标题在目录里不存在：`)
  for (const o of orphans) console.log(`    ${o}`)
}
if (missing.length) {
  console.log(`\n· 目录里有 ${missing.length} 条还没写说明${missingDangerous.length ? `（其中 ${missingDangerous.length} 条带危险标记，必须补）` : ''}：`)
  for (const c of missing.slice(0, 12))
    console.log(`    ${c.cmd}${c.danger ? `  ← ${c.danger}` : ''}`)
  if (missing.length > 12) console.log(`    … 另 ${missing.length - 12} 条`)
}
if (contraband.length) {
  console.log(`\n✗ ${contraband.length} 条说明里写了本该留在 commands.ts 的东西：`)
  for (const [k] of contraband) console.log(`    ${k}`)
}

const fatal = orphans.length + missingDangerous.length + contraband.length

/* ── 生成 ── */
const body = catalog
  .filter((c) => notes.get(c.cmd))
  .map((c) => `  ${JSON.stringify(c.cmd)}: ${JSON.stringify(notes.get(c.cmd))}`)
  .join(',\n')
const generated =
  `// 由 scripts/gen-command-notes.mjs 从 src/content/command-notes.zh.md 生成，勿手改。\n` +
  `// 站点是静态导出，运行时读不到 .md，所以说明必须在构建前编译进来。\n\n` +
  `export const COMMAND_NOTES: Record<string, string> = {\n${body}\n}\n\n` +
  `export function commandNote(cmd: string): string | null {\n` +
  `  return COMMAND_NOTES[cmd] ?? null\n}\n`

if (check) {
  const same = existsSync(OUT) && readFileSync(OUT, 'utf8') === generated
  if (!same) console.log('\n✗ 生成结果与已提交的 command-notes.ts 不一致，跑 --write')
  process.exit(fatal || !same ? 1 : 0)
}
if (!write) {
  console.log(`\n(dry-run，未写入；加 --write 生效)`)
  process.exit(fatal ? 1 : 0)
}
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, generated)
console.log(`\n已写入 ${OUT}（${catalog.filter((c) => notes.get(c.cmd)).length} 条）`)
process.exit(fatal ? 1 : 0)
