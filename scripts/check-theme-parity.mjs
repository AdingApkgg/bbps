/**
 * 校验「跟随系统」与「手动选定」两条暗色通路的值是否一致。
 *
 * 静态站没有服务端协商，暗色只能写成两份：`@media (prefers-color-scheme: …)` 管
 * 跟随系统，`[data-theme='…']` 管手动选。两份必须字字相同，否则手动选深色的人
 * 会少拿到令牌，而 CSS 自己不会报错 —— 所以用这个脚本把差异变成构建失败。
 *
 * 规则：媒体查询里的 `:root:not([data-theme='X']) <suffix>`（X 与介质相反）必须在
 * `:root[data-theme='<介质>'] <suffix>` 有对应块，声明集合相等。注释与缩进不计。
 * 同名的块可以出现多次（令牌块和阴影块就是两段），按 `主题|后缀` 合并后再比。
 *
 * 第二件事：`src/lib/theme-colors.ts` 里那几处「只能是字面颜色」的常量，
 * 必须与 `src/styles/tokens.css` 的调色板同值 —— 那是 JS 侧唯一的套刻。
 */
import { readFile } from 'node:fs/promises'

const FILES = ['src/styles/tokens.css', 'src/app/globals.css', 'src/styles/hig.css']

const MEDIA_RE = /@media \(prefers-color-scheme:\s*(dark|light)\)\s*\{/g
const MEDIA_ROOT_RE = /:root:not\(\[data-theme=["'](dark|light)["']\]\)/
const MANUAL_SELECTOR_RE = /:root\[data-theme=["'](dark|light)["']\]([^{]*)\{/g

/** 从 `open` 指向的 `{` 开始配对，返回 [内容, 结束下标] */
function matchBrace(text, open) {
  let depth = 0
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1
    else if (text[i] === '}') {
      depth -= 1
      if (depth === 0) return [text.slice(open + 1, i), i]
    }
  }
  throw new Error('括号没配对')
}

/** 去掉注释、空白、尾分号，剩下可比对的「属性:值」列表 */
function declarations(body) {
  return body
    .replaceAll(/\/\*[\s\S]*?\*\//g, '')
    .split(';')
    .map((line) => line.trim().replaceAll(/\s+/g, ' '))
    .filter(Boolean)
}

const manual = new Map()
const system = new Map()
const problems = []

function push(map, key, values, where) {
  if (!map.has(key)) map.set(key, { values: new Set(), where })
  for (const v of values) map.get(key).values.add(v)
}

for (const file of FILES) {
  const css = (await readFile(file, 'utf8')).replaceAll(/\/\*[\s\S]*?\*\//g, '')

  for (const m of css.matchAll(MANUAL_SELECTOR_RE)) {
    const [body] = matchBrace(css, m.index + m[0].length - 1)
    push(manual, `${m[1]}|${m[2].trim()}`, declarations(body), file)
  }

  for (const m of css.matchAll(MEDIA_RE)) {
    const [body] = matchBrace(css, m.index + m[0].length - 1)
    const theme = m[1]
    for (const rule of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = rule[1].trim()
      const root = selector.match(MEDIA_ROOT_RE)
      if (!root) continue
      /* 排除项必须与介质相反：系统已是 X 时，只有用户手动选了另一边才该被排除 */
      if (root[1] === theme) {
        problems.push(`${file}: 介质是 ${theme}，却排除同一个 ${root[1]} —— ${selector}`)
        continue
      }
      const suffix = selector.replace(MEDIA_ROOT_RE, '').trim()
      push(system, `${theme}|${suffix}`, declarations(rule[2]), file)
    }
  }
}

for (const [key, { values, where }] of system) {
  const [theme, suffix] = key.split('|')
  const label = suffix || ':root'
  const target = manual.get(key)
  if (!target) {
    problems.push(`${where}: 缺对应的 :root[data-theme='${theme}']${suffix} 块`)
    continue
  }
  for (const v of values) {
    if (!target.values.has(v)) problems.push(`${where}: 跟随系统有、手动选没有 —— ${label} ${v}`)
  }
  for (const v of target.values) {
    if (!values.has(v)) problems.push(`${where}: 手动选有、跟随系统没有 —— ${label} ${v}`)
  }
}

if (problems.length > 0) {
  console.error(`[theme-parity] ${problems.length} 处不一致：`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`[theme-parity] 暗色两条通路一致（${system.size} 组选择器）`)

/* 字面颜色常量 vs 调色板：值必须逐个相同，改一边就必须改另一边 */

const LITERALS = [
  ['--hig-palette-white', 'PALETTE_WHITE', '#ffffff'],
  ['--hig-palette-black', 'PALETTE_BLACK', '#000000'],
  ['--hig-palette-neutral-048', 'PALETTE_NEUTRAL_048', '#f2f2f7'],
  ['--hig-palette-neutral-820', 'PALETTE_NEUTRAL_820', '#1c1c1e']
]

const rawTokens = await readFile('src/styles/tokens.css', 'utf8')
const rawLiterals = await readFile('src/lib/theme-colors.ts', 'utf8')
const literalProblems = []

for (const [token, constant, expected] of LITERALS) {
  const found = rawTokens.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})\\s*;`))
  if (!found) literalProblems.push(`src/styles/tokens.css: 找不到 ${token}`)
  else if (found[1].toLowerCase() !== expected)
    literalProblems.push(`src/styles/tokens.css: ${token} 实际是 ${found[1]}`)

  const declared = rawLiterals.match(new RegExp(`export const ${constant} = '(#[0-9a-fA-F]{6})'`))
  if (!declared) literalProblems.push(`src/lib/theme-colors.ts: 缺 ${constant}（${token}）`)
  else if (declared[1].toLowerCase() !== expected)
    literalProblems.push(
      `src/lib/theme-colors.ts: ${constant} 写成 ${declared[1]}，调色板是 ${expected}`
    )
}

if (literalProblems.length > 0) {
  console.error(`[theme-parity] ${literalProblems.length} 处字面颜色与调色板不一致：`)
  for (const p of literalProblems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`[theme-parity] theme-colors.ts 的 ${LITERALS.length} 个字面常量与调色板一致`)
