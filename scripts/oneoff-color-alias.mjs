/* 一次性：把 `--color-*` 接入层拆掉，类名改写成 `x-(--hig-*)` 任意值写法。
   跑完即可删。`--color-*` 是给 shadcn 词用的转发层，拆掉后语义令牌是唯一真源。

   两条硬约束：
   · 顺序——`border-s` 是 `border` 的前缀，必须长的先跑；`border-t` 等仍能吞掉 `t-` 后的名字；
   · 透明度——`bg-primary/12` 这种斜杠写法在任意值里是 `bg-(--hig-color-primary)/12`，
     不拆成 `color-mix`，保持与 Tailwind 原生修饰一致。 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ALIAS = /\n[ \t]*--color-([a-z0-9-]+):\s*var\((--hig-[a-z0-9-]+)\);/g

const css = await readFile('src/app/globals.css', 'utf8')
const map = new Map([...css.matchAll(ALIAS)].map((m) => [m[1], m[2]]))
console.log(`读到 ${map.size} 条别名`)

/* 前缀长的先跑：border-s 会吃掉 border-ss/border-se，必须在 border 之前 */
const PREFIXES = [
  'border-s',
  'border-e',
  'border-t',
  'border-b',
  'border-l',
  'border-r',
  'border-x',
  'border-y',
  'border',
  'divide-y',
  'divide-x',
  'divide',
  'bg',
  'text',
  'fill',
  'stroke',
  'outline',
  'ring',
  'ring-offset',
  'from',
  'via',
  'to',
  'accent',
  'caret',
  'decoration',
  'shadow'
]

/* 别名长的先跑：`surface` 会让 `surface-01` 匹配失败。别名表里存的是完整名，
   前缀和前导不用再拼 —— `text-on-surface` = 前缀 `text` + 别名 `on-surface`。 */
const ALIASES = [...map.keys()].sort((a, b) => b.length - a.length)
const byPrefix = new Map(PREFIXES.map((prefix) => [prefix, ALIASES]))

const walk = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (/\.(tsx?|css)$/.test(entry.name)) out.push(path)
  }
  return out
}

const files = (await walk('src')).filter((f) => f !== 'src/app/globals.css')
let total = 0
const misses = []

for (const file of files) {
  let text = await readFile(file, 'utf8')
  const before = text
  for (const prefix of PREFIXES) {
    for (const alias of byPrefix.get(prefix)) {
      const token = map.get(alias)
      /* 前面不能是字母数字横线（避免 text-body-01 撞 text-body），斜杠透明度单独放行 */
      const re = new RegExp(`(?<![a-z0-9-])${prefix}-${alias}(?![a-z0-9-])`, 'g')
      total += (text.match(re) ?? []).length
      text = text.replace(re, `${prefix}-(${token})`)
    }
  }
  if (text !== before) await writeFile(file, text)
}

/* 剩余以别名命名的类名逐个记下来人工核 */
for (const file of files) {
  const text = await readFile(file, 'utf8')
  for (const prefix of PREFIXES) {
    for (const alias of byPrefix.get(prefix)) {
      const re = new RegExp(`(?<![a-z0-9-])${prefix}-${alias}(?![a-z0-9-])`)
      if (re.test(text)) misses.push(`${file}: ${prefix}-${alias}`)
    }
  }
}

console.log(`改写 ${total} 处；残留 ${misses.length} 处`)
if (misses.length) console.log(misses.join('\n'))
