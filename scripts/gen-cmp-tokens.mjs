#!/usr/bin/env node
/**
 * 组件槽位索引：`--hig-cmp-*` 的清单、默认值与使用处。
 *
 *   node scripts/gen-cmp-tokens.mjs             # 只报告
 *   node scripts/gen-cmp-tokens.mjs --write     # 写 docs/component-tokens.md
 *   node scripts/gen-cmp-tokens.mjs --check     # 与文档不一致就退出 1，供 bun run check / CI 用
 *
 * 为什么需要它：组件槽位不写在 CSS 里，而是散在 TSX 的 `var(--hig-cmp-x, 默认值)` 内联写法中，
 * 外部用 `[--hig-cmp-x:值]` 覆盖。好处是组件不必先声明再使用，坏处是没人能一眼看出
 * 「这个组件有哪些可调项」——文档只能靠扫代码生成，手写必然漂移。
 *
 * 归属规则：槽位名第一段（`--hig-cmp-` 之后到第一个 `-`）即所属组件。`field`、`menu` 这类
 * 名字被多个组件共用，按前缀归组反而正确，因为覆盖它的人就是按这个语义去找的。
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'docs/component-tokens.md')
const SRC = join(ROOT, 'src')

const argv = process.argv.slice(2)
const write = argv.includes('--write')
const check = argv.includes('--check')

const SLOT_RE = /--hig-cmp-([a-z0-9-]+)/g

/** 收集 .tsx / .ts / .css，跳过生成的与第三方 */
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'generated') continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else if (/\.(tsx|ts|css)$/.test(entry)) out.push(full)
  }
  return out
}

/** 从 `--hig-cmp-x` 之后取默认值：`,` 后若是 `var(` 就配平括号，否则取到最近的 `)` 或 `]` */
function fallbackAfter(text, end) {
  const rest = text.slice(end)
  const m = rest.match(/^\s*,\s*/)
  if (!m) return ''
  const i = end + m[0].length
  if (text.startsWith('var(', i)) {
    let depth = 0
    for (let j = i + 3; j < text.length; j += 1) {
      if (text[j] === '(') depth += 1
      else if (text[j] === ')') {
        depth -= 1
        if (depth === 0) return text.slice(i, j + 1).replaceAll(/\s+/g, ' ')
      }
    }
    return ''
  }
  const stop = text.slice(i).search(/[)\]]/)
  return stop === -1
    ? ''
    : text
        .slice(i, i + stop)
        .replaceAll(/\s+/g, ' ')
        .trim()
}

/** 行号：数到 `index` 之前有几个换行 */
function lineOf(text, index) {
  let line = 1
  for (let i = 0; i < index; i += 1) if (text[i] === '\n') line += 1
  return line
}

const slots = new Map()

for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  for (const m of text.matchAll(SLOT_RE)) {
    const name = m[1]
    /* 注释里的 `--hig-cmp-badge-*` 是散文通配，不是槽位 */
    if (name.endsWith('-') || text[m.index + m[0].length] === '*') continue
    const fallback = fallbackAfter(text, m.index + m[0].length)
    const at = `${rel}:${lineOf(text, m.index)}`
    if (!slots.has(name)) slots.set(name, { defaults: new Set(), uses: new Set() })
    const slot = slots.get(name)
    if (fallback) slot.defaults.add(fallback)
    slot.uses.add(at)
  }
}

if (slots.size === 0) {
  console.error('[cmp-tokens] 一个槽位都没找到，扫描路径大概错了')
  process.exit(1)
}

const groups = new Map()
for (const [name, slot] of slots) {
  const group = name.split('-')[0]
  if (!groups.has(group)) groups.set(group, [])
  groups.get(group).push([name, slot])
}
for (const list of groups.values()) list.sort((a, b) => a[0].localeCompare(b[0]))

const lines = [
  '# 组件槽位索引',
  '',
  '> 本文件由 `scripts/gen-cmp-tokens.mjs` 生成，不要手改。',
  '> 改完槽位后跑 `node scripts/gen-cmp-tokens.mjs --write`；`bun run check` 会拒绝过期版本。',
  '',
  '组件槽位不预先声明，而是在 TSX 里内联写成 `var(--hig-cmp-x, 默认值)`，',
  '外部用 Tailwind 的任意属性 `[--hig-cmp-x:值]` 覆盖。',
  '「默认」列就是没人覆盖时生效的值，「使用处」列是它出现的位置。',
  '',
  `共 ${slots.size} 个槽位，${groups.size} 组。`,
  ''
]

for (const group of [...groups.keys()].sort()) {
  const list = groups.get(group)
  lines.push(`## ${group}（${list.length}）`, '', '| 槽位 | 默认 | 使用处 |', '| --- | --- | --- |')
  for (const [name, slot] of list) {
    const fallback = [...slot.defaults].join(' / ') || '—'
    const uses = [...slot.uses].sort().join('<br>')
    lines.push(`| \`--hig-cmp-${name}\` | \`${fallback}\` | ${uses} |`)
  }
  lines.push('')
}

const rendered = `${lines.join('\n').trimEnd()}\n`

if (check) {
  let current = ''
  try {
    current = readFileSync(OUT, 'utf8')
  } catch {
    console.error(
      `[cmp-tokens] 缺 ${relative(ROOT, OUT)}，跑 node scripts/gen-cmp-tokens.mjs --write`
    )
    process.exit(1)
  }
  if (current !== rendered) {
    console.error(
      `[cmp-tokens] ${relative(ROOT, OUT)} 已过期，跑 node scripts/gen-cmp-tokens.mjs --write`
    )
    process.exit(1)
  }
  console.log(`[cmp-tokens] ${slots.size} 个槽位与文档一致`)
} else if (write) {
  writeFileSync(OUT, rendered)
  console.log(`[cmp-tokens] 写入 ${relative(ROOT, OUT)}（${slots.size} 个槽位，${groups.size} 组）`)
} else {
  console.log(`[cmp-tokens] ${slots.size} 个槽位，${groups.size} 组；加 --write 落盘`)
}
