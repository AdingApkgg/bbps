#!/usr/bin/env node
/**
 * 用生产服务器的真实使用量给指令目录的分组排序。
 *
 *   node scripts/rank-by-usage.mjs            # 只报告
 *   node scripts/rank-by-usage.mjs --write    # 写回 lib/commands.ts
 *   node scripts/rank-by-usage.mjs --api <url>
 *
 * 数据源：GET /api/global_statistics 的 PlayerStatistics.hbcmd_run_<指令>。
 * 注意粒度只到基指令 —— /resource fill 与 /resource 1 9999999 共用
 * hbcmd_run_resource 这一个计数器，子指令之间无法区分。
 * 因此这里只用它做组间排序，不给条目打「常用」标记，也不做更细的推断。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const write = process.argv.includes('--write')
const apiIdx = process.argv.indexOf('--api')
const API = apiIdx > -1 ? process.argv[apiIdx + 1] : 'https://webapi.30hb.cn'

const res = await fetch(`${API}/api/global_statistics`)
if (!res.ok) {
  console.error(`拉取失败：HTTP ${res.status}`)
  process.exit(1)
}
const body = await res.json()
const stats = (body.body ?? body).PlayerStatistics
if (!stats) {
  console.error('响应里没有 PlayerStatistics')
  process.exit(1)
}

const usage = new Map()
for (const [k, v] of Object.entries(stats)) {
  if (k.startsWith('hbcmd_run_') && k.length > 10 && typeof v === 'number') {
    usage.set(k.slice(10).toLowerCase(), v)
  }
}
const grandTotal = [...usage.values()].reduce((a, b) => a + b, 0)

const FILE = join(__dirname, '../src/lib/commands.ts')
const src = readFileSync(FILE, 'utf8')

/**
 * 一条指令的使用量 = 主名与所有别名的计数之和。
 * 服务端给每个别名各记一个计数器（/attackplayer 2,549 · /attackp 60 · /atkp 13,739），
 * 但 C# 里 atkp 是 Redirect(CmdAttackPlayer)，同一条指令，所以要相加。
 * 取 max 会漏掉别名那部分 —— 曾因此把「进攻」组的占比算成 2%（实为 5.5%）。
 */
function usageOf(cmd, aliases) {
  const keys = [
    ...new Set([cmd, ...aliases].map((c) => c.replace(/^\//, '').split(/\s+/)[0].toLowerCase()))
  ]
  return keys.reduce((sum, k) => sum + (usage.get(k) ?? 0), 0)
}

const entries = [...src.matchAll(/C\(\{([\s\S]*?)\}\)/g)]
  .map((m) => {
    const b = m[1]
    const cmd = (b.match(/cmd:\s*'([^']+)'/) || [])[1]
    const group = (b.match(/group:\s*'([^']+)'/) || [])[1]
    const al = b.match(/aliases:\s*\[([^\]]*)\]/)?.[1] ?? ''
    const aliases = [...al.matchAll(/'([^']+)'/g)].map((x) => x[1])
    return { cmd, group, aliases, n: usageOf(cmd || '', aliases) }
  })
  .filter((e) => e.cmd)

/* ── 组间排序：按组内使用量之和，但闪退自救固定置顶（应急入口，低使用是正常的）。
   求和必须按基指令去重 —— /resource、/resource fill、/resource proto 是三条目录
   条目却共用 hbcmd_run_resource 这一个计数器，直接逐条相加会把它算三遍
   （实测各组占比会加到 328%），组间名次也会因此排错。 ── */
const groupSum = {}
const counted = {}
for (const e of entries) {
  groupSum[e.group] ??= 0
  const key = e.cmd.replace(/^\//, '').split(/\s+/)[0].toLowerCase()
  counted[e.group] ??= new Set()
  const seen = counted[e.group]
  if (seen.has(key)) continue
  seen.add(key)
  groupSum[e.group] += e.n
}
const ordered = Object.keys(groupSum).sort((a, b) => {
  if (a === 'rescue') return -1
  if (b === 'rescue') return 1
  return groupSum[b] - groupSum[a]
})

console.log(`总执行 ${grandTotal.toLocaleString()} 次，覆盖 ${usage.size} 个基指令`)
console.log(`目录 ${entries.length} 条，零使用 ${entries.filter((e) => e.n === 0).length} 条`)
console.log()
console.log('组排序（闪退自救固定置顶）：')
for (const g of ordered) {
  console.log(
    `  ${g.padEnd(10)}${String(groupSum[g]).padStart(10)}  ${((groupSum[g] / grandTotal) * 100).toFixed(1)}%`
  )
}
console.log()
console.log('各组内前 3（组内也按使用量排）：')
for (const g of ordered) {
  const top = entries
    .filter((e) => e.group === g)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3)
  console.log(`  ${g.padEnd(10)}${top.map((t) => `${t.cmd}(${t.n.toLocaleString()})`).join('  ')}`)
}

if (!write) {
  console.log('\n(dry-run，未写入；加 --write 生效)')
  process.exit(0)
}

/* ── 写回：只调组顺序。
   条目本身不打「常用」标记 —— 计数只到基指令粒度，
   /coop 的 7 个子指令会被同一个数字带上，标出来是假精度。 ── */
let out = src

// 组顺序：用括号配对切块，meta 里混了多行与单行两种写法，正则切不干净
const metaRe = /export const COMMAND_GROUP_META: CommandGroupMeta\[\] = \[([\s\S]*?)\n\]/
const metaMatch = out.match(metaRe)
if (!metaMatch) {
  console.error('没找到 COMMAND_GROUP_META')
  process.exit(1)
}
const metaBody = metaMatch[1]
const blocks = []
let depth = 0,
  start = -1
for (let i = 0; i < metaBody.length; i++) {
  const c = metaBody[i]
  if (c === '{') {
    if (depth === 0) start = i
    depth++
  } else if (c === '}') {
    depth--
    if (depth === 0) blocks.push(metaBody.slice(start, i + 1))
  }
}
const byId = {}
for (const b of blocks) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (id) byId[id] = b.trim()
}
const missing = ordered.filter((g) => !byId[g])
if (missing.length) {
  console.error(`这些组在 meta 里找不到：${missing.join(', ')}`)
  process.exit(1)
}
const rest = Object.keys(byId).filter((g) => !ordered.includes(g))
const reordered = [...ordered, ...rest].map((g) => byId[g]).join(',\n  ')
out = out.replace(
  metaRe,
  `export const COMMAND_GROUP_META: CommandGroupMeta[] = [\n  ${reordered}\n]`
)

writeFileSync(FILE, out, 'utf8')
console.log('\n已写入 src/lib/commands.ts')
