/* 一次性：把 M3 语汇改回 HIG 命名。跑完即可删。
   `--hig-color-on-surface*` 是 Material 的「on X 表面」句式；HIG 对应 label、
   separator、systemFill 三族。elevation 是 M3 的层高说法，HIG 叫 layer。 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const RENAMES = [
  ['--hig-color-on-surface-medium', '--hig-color-label-secondary'],
  ['--hig-color-on-surface-helper', '--hig-color-label-tertiary'],
  ['--hig-color-on-surface-placeholder', '--hig-color-label-quaternary'],
  ['--hig-color-on-surface-disabled', '--hig-color-label-disabled'],
  ['--hig-color-on-surface', '--hig-color-label'],
  ['--hig-color-on-inverse-surface', '--hig-color-label-inverse'],
  ['--hig-color-outline-field', '--hig-color-separator-field'],
  ['--hig-color-outline-disabled', '--hig-color-separator-disabled'],
  ['--hig-color-outline-emphasis-01', '--hig-color-separator-emphasis'],
  ['--hig-color-outline-emphasis', '--hig-color-separator-emphasis'],
  ['--hig-color-outline-variant-01', '--hig-color-separator-variant'],
  ['--hig-color-outline-01', '--hig-color-separator-01'],
  ['--hig-color-outline-00', '--hig-color-separator-strong'],
  ['--hig-color-outline', '--hig-color-separator'],
  ['--hig-color-state-hover', '--hig-color-fill-hover'],
  ['--hig-color-state-pressed', '--hig-color-fill-pressed'],
  ['--hig-color-state-selected', '--hig-color-fill-selected'],
  ['--hig-color-surface-hover-01', '--hig-color-fill-secondary'],
  ['--hig-color-surface-hover-02', '--hig-color-fill-tertiary'],
  ['--hig-color-surface-disabled-01', '--hig-color-fill-disabled'],
  ['--hig-color-surface-variant-01', '--hig-color-fill-subtle'],
  ['--hig-color-field-01', '--hig-color-field'],
  ['--hig-color-field-hover-01', '--hig-color-field-hover'],
  ...['01', '02', '04', '06', '08', '16', '24'].map((n) => [
    `--hig-elevation-${n}`,
    `--hig-layer-${n}`
  ])
]

const longFirst = [...RENAMES].sort((a, b) => b[0].length - a[0].length)

const walk = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (/\.(tsx?|css|mjs)$/.test(entry.name)) out.push(path)
  }
  return out
}

let files = 0
for (const file of await walk('src')) {
  let text = await readFile(file, 'utf8')
  const before = text
  for (const [from, to] of longFirst) {
    /* 词尾要有边界：--x 是 --x-01 的前缀 */
    text = text.replaceAll(new RegExp(`${from}(?![a-z0-9-])`, 'g'), to)
  }
  /* contained 是 M3 按钮术语，HIG 叫 filled */
  text = text.replaceAll('contained', 'filled')
  if (text !== before) {
    files += 1
    await writeFile(file, text)
  }
}

/* 弃用的 outline-emphasis 已并进 separator-emphasis，定义行删掉 */
const tokens = 'src/styles/tokens.css'
let css = await readFile(tokens, 'utf8')
css = css.replaceAll(
  /^[ \t]*--hig-color-separator-emphasis: var\(\n?[^;]*;\s*\/\* @deprecated[^\n]*\n/gm,
  ''
)
await writeFile(tokens, css)

console.log(`改名文件 ${files} 个`)
