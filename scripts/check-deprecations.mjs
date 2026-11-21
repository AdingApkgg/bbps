/**
 * 令牌与组件的弃用台账（规则见 docs/design-system.md 第十节）。
 *
 * 标记写法是在定义行尾或上一行写 `/* @deprecated YYYY-MM-DD → 替身 *\/`。
 * 这个脚本做两件事：
 *   1. 把「已有引用」的弃用项变成构建失败，并列出前几处 —— 弃用注释写完就必须同批迁完。
 *   2. 引用清零满 30 天仍没删的，提醒（不拦）。
 *
 * 只认 `--hig-*` 令牌，组件另走文档里的表；扫描范围只有 `src/`（文档里的弃用表本来就写旧名）。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOTS = ['src']
const SKIP = new Set(['node_modules', '_preview', 'preview.html'])
const DEF_RE =
  /(--hig-[a-z0-9-]+)(?::[^;]*)?;\s*\/\* @deprecated (\d{4}-\d{2}-\d{2})(?:\s*→\s*(--hig-[a-z0-9-]+))?/
const GRACE_DAYS = 30

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (SKIP.has(entry.name)) continue
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || path === 'src/app/fonts') continue
      yield* walk(path)
    } else if (/\.(css|tsx?|mjs|md)$/.test(path)) {
      yield path
    }
  }
}

/** 定义文件：令牌只在 tokens.css 与 hig.css 定义 */
const DEF_FILES = new Set(['src/styles/tokens.css', 'src/styles/hig.css'])

const files = []
for (const root of ROOTS) {
  for await (const file of walk(root)) files.push(file)
}

const deprecations = new Map()
for (const file of files) {
  if (!DEF_FILES.has(file)) continue
  const text = await readFile(file, 'utf8')
  for (const m of text.matchAll(new RegExp(DEF_RE, 'g'))) {
    const line = text.slice(0, m.index).split('\n').length
    if (deprecations.has(m[1])) continue
    deprecations.set(m[1], { since: m[2], replacement: m[3], file, line })
  }
}

if (deprecations.size === 0) {
  console.log('[deprecations] 无弃用令牌')
  process.exit(0)
}

const uses = new Map()
for (const file of files) {
  if (DEF_FILES.has(file)) continue
  const text = await readFile(file, 'utf8')
  for (const name of deprecations.keys()) {
    /* 词尾要有边界：--a 是 --a-01 的前缀，用 indexOf 会互相误报 */
    for (const m of text.matchAll(new RegExp(`${name}(?![a-z0-9-])`, 'g'))) {
      const line = text.slice(0, m.index).split('\n').length
      const list = uses.get(name) ?? []
      list.push(`${file}:${line}`)
      uses.set(name, list)
    }
  }
}

const today = Date.now()
const stillUsed = []
const expired = []
for (const [name, info] of deprecations) {
  const list = uses.get(name) ?? []
  if (list.length > 0) stillUsed.push([name, info, list])
  else {
    const days = Math.floor((today - Date.parse(info.since)) / 86_400_000)
    if (days >= GRACE_DAYS) expired.push([name, info, days])
  }
}

if (stillUsed.length > 0) {
  console.error(`[deprecations] ${stillUsed.length} 个弃用令牌仍在被引用：`)
  for (const [name, info, list] of stillUsed) {
    const suggest = info.replacement ? ` → ${info.replacement}` : ''
    console.error(`  - ${name}（${info.file}:${info.line} 起弃于 ${info.since}${suggest}）`)
    for (const where of list.slice(0, 3)) console.error(`      ${where}`)
    if (list.length > 3) console.error(`      …另有 ${list.length - 3} 处`)
  }
  console.error(
    '  迁移：bun scripts/migrate-token.mjs --from <旧令牌> --to <新令牌>；或 --delete 直删。'
  )
  process.exit(1)
}

for (const [name, info, days] of expired) {
  console.warn(
    `[deprecations] ${name} 已弃 ${days} 天（>${GRACE_DAYS}），可以删定义了（${info.file}:${info.line}）`
  )
}
console.log(`[deprecations] ${deprecations.size} 个弃用令牌，引用已清零`)

/* 试验态只统计不拦：名字本来就可以随时改，拦就是逼人先删再改 */
let experimental = 0
for (const file of files) {
  if (!file.startsWith('src/')) continue
  experimental += (await readFile(file, 'utf8')).match(/@experimental/g)?.length ?? 0
}
if (experimental > 0) console.log(`[deprecations] 另有 ${experimental} 处 @experimental（不拦）`)
