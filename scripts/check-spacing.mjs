/**
 * 间距白名单：`gap-1.5` / `p-2.5` 这类不在 4px 阶上的值，必须逐个登记才准用。
 *
 * `src/app/globals.css` 把 `--spacing` 钉成 4px，合法刻度就是 4px 的整数倍。
 * Tailwind 仍认 `0.5`（2px）、`1.5`（6px）、`2.5`（10px）、`3.5`（14px），
 * 于是「同一个 8px 有时写 gap-2、有时写 gap-3.5 旁边的 gap-1.5」就会慢慢长出来。
 *
 * 规则：上面四种分值一律视为越界。**要新增就先加进这张表**，加的时候顺手看看
 * 能不能归到相邻整数档（2px→4px、6px→4 或 8px、10px→8 或 12px、14px→12 或 16px）。
 * 表里退成空就是「全部归零」，那时把这行注释删掉、规则自动变成全站硬性。
 *
 * 只扫 `src/**\/*.tsx`：CSS 里的 px 是版面语汇（发丝线、让位距离），另有它的刻度。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOTS = ['src']

/** 已被容忍的越界值（新增要在这里出现） */
const ALLOWED = new Set([
  'w-3.5',
  'w-0.5',
  'h-3.5',
  'size-3.5',
  'mt-0.5',
  'gap-0.5',
  'gap-y-0.5',
  'p-0.5',
  'py-0.5',
  'ml-0.5',
  'mr-0.5',
  'pt-0.5'
])

/** 间距与尺寸族；`w-*`/`h-*`/`size-*` 同用 4px 基数 */
const PROP =
  'p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|inset|inset-x|inset-y'
const OFF_GRID_RE = new RegExp(`(?<![-\\w])(?:${PROP})-(0\\.5|1\\.5|2\\.5|3\\.5|4\\.5)\\b`, 'g')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      yield* walk(path)
    } else if (path.endsWith('.tsx')) {
      yield path
    }
  }
}

const hits = new Map()
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const text = await readFile(file, 'utf8')
    for (const m of text.matchAll(OFF_GRID_RE)) {
      const token = m[0]
      if (ALLOWED.has(token)) continue
      const line = text.slice(0, m.index).split('\n').length
      const list = hits.get(token) ?? []
      list.push(`${file}:${line}`)
      hits.set(token, list)
    }
  }
}

if (hits.size > 0) {
  console.error(`[spacing-lint] ${hits.size} 个越界间距值未登记：`)
  for (const [token, where] of [...hits].sort()) {
    console.error(`  - ${token}（${where.length} 处）：${where.slice(0, 3).join('、')}`)
  }
  console.error('  改到相邻整数档，或加进 scripts/check-spacing.mjs 的 ALLOWED。')
  process.exit(1)
}

console.log(`[spacing-lint] 间距全在 4px 阶上（容忍 ${ALLOWED.size} 个登记值）`)
