#!/usr/bin/env node
/**
 * 整理 src/data/commands.json
 *
 *   node scripts/tidy-commands.mjs          # 只报告，不写入
 *   node scripts/tidy-commands.mjs --write  # 实际写入
 *
 * 做三件事：
 *   1. 去重：同一条指令文本出现在多个分类里，保留信息量更大的名称
 *   2. 重命名分类「全部」→「指令总览」，避免与 UI 的「全部分类」筛选混淆
 *   3. 清理推测性名称，如「（可能为游戏内特定功能指令）」
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = join(__dirname, '../src/data/commands.json')
const write = process.argv.includes('--write')

const data = JSON.parse(readFileSync(FILE, 'utf8'))
const report = { dropped: [], renamed: [], category: null }

/* ── 1. 去重 ── */
// 名称信息量打分：越大越该保留
function informativeness(entry) {
  let s = entry.name.length
  if (/可能为|疑似|同前|待补充/.test(entry.name)) s -= 100  // 推测性措辞
  if (entry.category === '全部') s -= 20                    // 词表里的名称通常更笼统
  return s
}

const byCommand = new Map()
for (const cmd of data.commands) {
  const list = byCommand.get(cmd.command) ?? []
  list.push(cmd)
  byCommand.set(cmd.command, list)
}

const keep = new Set()
for (const [, list] of byCommand) {
  if (list.length === 1) {
    keep.add(list[0])
    continue
  }
  const sorted = [...list].sort((a, b) => informativeness(b) - informativeness(a))
  keep.add(sorted[0])
  for (const dropped of sorted.slice(1)) {
    report.dropped.push({
      command: dropped.command,
      dropped: `${dropped.name} [${dropped.category}]`,
      kept: `${sorted[0].name} [${sorted[0].category}]`
    })
  }
}

data.commands = data.commands.filter((c) => keep.has(c))

/* ── 2. 分类「全部」改名 ── */
const allCat = data.categories.find((c) => c.id === '全部')
if (allCat && allCat.nameZh === '全部指令') {
  report.category = `${allCat.nameZh} / ${allCat.nameEn} → 指令总览 / Reference`
  allCat.nameZh = '指令总览'
  allCat.nameEn = 'Reference'
}

/* ── 3. 清理推测性名称 ── */
// 只做「删除推测性括号」和「补上已知别名指向」，不臆造含义
const ALIAS_OF = { '/bebean': '/Bebean', '/utc': '/UTC' }

for (const cmd of data.commands) {
  const before = cmd.name
  let name = cmd.name

  const target = ALIAS_OF[cmd.command]
  if (target) {
    const canonical = data.commands.find((c) => c.command === target)
    if (canonical) name = `${canonical.name.replace(/（[^）]*）$/, '')}（同 ${target}）`
  } else {
    // 去掉推测性括号；括号外还剩内容就用剩下的，否则标为待补充
    name = name.replace(/（[^）]*(?:可能为|疑似|同前)[^）]*）/g, '').trim()
    if (!name) name = '说明待补充'
  }

  if (name !== before) report.renamed.push({ command: cmd.command, before, after: name })
  cmd.name = name
}

/* ── 报告 ── */
console.log(`去重：删除 ${report.dropped.length} 条重复条目`)
for (const d of report.dropped.slice(0, 10)) {
  console.log(`   ${d.command}`)
  console.log(`     保留 ${d.kept}`)
  console.log(`     删除 ${d.dropped}`)
}
if (report.dropped.length > 10) console.log(`   …另有 ${report.dropped.length - 10} 条`)

console.log(`\n分类改名：${report.category ?? '（无）'}`)

console.log(`\n名称清理：${report.renamed.length} 条`)
for (const r of report.renamed) {
  console.log(`   ${r.command.padEnd(18)} ${r.before}  →  ${r.after}`)
}

console.log(`\n条目数：${report.dropped.length + data.commands.length} → ${data.commands.length}`)

if (write) {
  writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log('\n已写入 src/data/commands.json')
} else {
  console.log('\n(dry-run，未写入；加 --write 生效)')
}
