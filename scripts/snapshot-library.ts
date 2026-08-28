/**
 * 「指令库」渲染结果的快照，用作重构的回归基线。
 *
 *   bun run scripts/snapshot-library.ts              # 打到 stdout
 *   bun run scripts/snapshot-library.ts --out <文件>
 *
 * 记的是「用户最终能拿到哪些指令字符串」，不是内部结构 —— 数据源换成
 * 合成的之后内部结构必然变，但用户能选出来的集合必须能逐行对得上。
 * 用 bun 跑是因为它要 import 真正的 TS 数据源，而不是另抄一份解析。
 */
import { writeFileSync } from 'node:fs'
import { commands, categories } from '../src/lib/commands-data'

const i = process.argv.indexOf('--out')
const OUT = i > -1 ? process.argv[i + 1] : null

const rows = commands
  .map((c) => `${c.category}\t${c.command}\t${c.name}`)
  .sort()
const cats = categories
  .map((c) => `${c.id}\t${c.nameZh}\t${c.nameEn}`)
  .sort()

const report = [
  '# 指令库快照',
  `条目 ${commands.length} · 分类 ${categories.length}`,
  '',
  '## 分类',
  ...cats,
  '',
  '## 条目（分类 \\t 指令 \\t 展示名）',
  ...rows
].join('\n')

if (OUT) {
  writeFileSync(OUT, report + '\n')
  console.log(`已写入 ${OUT}（${commands.length} 条）`)
} else {
  console.log(report)
}
