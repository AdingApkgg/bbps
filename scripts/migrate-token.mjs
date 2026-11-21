/**
 * 令牌迁移：改名的机械部分交给脚本，别手改（规则见 docs/design-system.md 第十节）。
 *
 *   bun scripts/migrate-token.mjs --from --hig-color-foo --to --hig-color-bar   全量替换 + 标弃
 *   bun scripts/migrate-token.mjs --from --hig-color-foo                       只标弃，留给后续
 *   bun scripts/migrate-token.mjs --from --hig-color-foo --delete              替换后删定义
 *
 * 替换范围只有 `src/`（docs 里写旧名往往是有意的，比如弃用表本身）。
 * 用 `--hig-` 前缀 + 词尾负向前瞻匹配，`-01`、`-2`、`-hover` 这些后缀不会被残断。
 * 定义本身（`tokens.css` 的 `--hig-color-*）也在替换范围外，另由 --to 改写其值：
 * 只有当旧令牌定义成 `var(新令牌)` 时才改值，否则保守保留原值并提示。
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TOKEN_RE = /^--hig-[a-z0-9-]+$/
const ROOTS = ['src']
const SKIP = new Set(['node_modules', '_preview', 'preview.html'])
const DEF_FILES = ['src/styles/tokens.css', 'src/styles/hig.css']

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--delete') out.delete = true
    else if (arg === '--from') out.from = argv[++i]
    else if (arg === '--to') out.to = argv[++i]
    else if (arg === '--dry') out.dry = true
  }
  return out
}

const { from, to, delete: removeDef, dry } = parseArgs(process.argv.slice(2))

if (!from || !TOKEN_RE.test(from)) {
  console.error(
    '用法：bun scripts/migrate-token.mjs --from --hig-color-old [--to --hig-color-new] [--delete] [--dry]'
  )
  process.exit(1)
}
if (to !== undefined && !TOKEN_RE.test(to)) {
  console.error(`--to 必须是令牌名：${to}`)
  process.exit(1)
}
if (removeDef && !to) {
  console.error('--delete 需要同时给 --to，否则不知道定义改成什么')
  process.exit(1)
}

const escape = (s) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
/* 词尾：后面不能紧跟字母数字或连字符（`--a-01` 不会命中 `--a-011`，`--a` 不会命中 `--a-b`） */
const MATCH = new RegExp(`${escape(from)}(?![a-z0-9-])`, 'g')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (SKIP.has(entry.name)) continue
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.')) continue
      yield* walk(path)
    } else if (/\.(css|tsx?|mjs|md)$/.test(path)) {
      yield path
    }
  }
}

const stamp = new Date().toISOString().slice(0, 10)
const changed = []
let total = 0

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    let text = await readFile(file, 'utf8')
    const original = text

    /* 定义行可能有亮/暗多份，全部先换成占位符：全局替换会把定义名一起改掉，之后再也定位不到 */
    const defs = DEF_FILES.includes(file)
      ? [...original.matchAll(new RegExp(`^\\s*${escape(from)}:[^;]*;`, 'gm'))]
      : []
    const marks = []
    let staged = original
    defs.forEach((def, i) => {
      const line = def[0]
      staged = staged.replace(line, `@@HIG_DEF_${i}@@`)
      const colon = line.indexOf(':')
      const restOfLine = original.slice(
        def.index + line.length,
        original.indexOf('\n', def.index + line.length)
      )
      marks.push({
        name: line.slice(0, colon).trim(),
        value: line.slice(colon + 1, -1).trim(),
        marked: restOfLine.includes('@deprecated')
      })
    })

    if (to) {
      const before = staged
      staged = staged.replaceAll(MATCH, to)
      if (staged !== before) {
        const hits = before.match(MATCH)?.length ?? 0
        total += hits
        changed.push(`${file}（${hits}）`)
      }
    }

    defs.forEach((_, i) => {
      if (removeDef) {
        staged = staged.replace(`@@HIG_DEF_${i}@@\n`, '').replace(`@@HIG_DEF_${i}@@`, '')
        return
      }
      const { name, value, marked } = marks[i]
      if (to && value !== `var(${to})` && !marked)
        console.warn(`  ! ${file}:${name} 的值是 ${value}，不是 var(${to})，请逐个确认`)
      const line = marked
        ? `${name}: ${value};`
        : `${name}: ${value}; /* @deprecated ${stamp} → ${to ?? '待定'} */`
      staged = staged.replace(`@@HIG_DEF_${i}@@`, line)
    })

    text = staged

    if (text !== original && !dry) await writeFile(file, text)
  }
}

if (total === 0 && !removeDef) console.warn(`没有引用需要替换（${from} 只标了弃用）`)
for (const line of changed) console.log(`  ${line}`)
console.log(
  `${dry ? '[dry] ' : ''}${from}${to ? ` → ${to}` : ''}：${changed.length} 个文件、${total} 处${removeDef ? '，定义已删' : to ? '，定义已标弃用' : '，定义已标弃用（替身待定）'}`
)
if (total > 0) console.log('接着跑 bun run check:deprecations 确认清零。')
