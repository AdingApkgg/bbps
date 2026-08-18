import { commands, type Command } from '@/lib/commands-data'

/**
 * 指令搜索。
 *
 * 用精确子串匹配 + 相关性排序，而不是 Fuse.js 这类模糊搜索：
 * 实测在这份数据上模糊匹配没带来错字容错（"renmae" 两者都是 0 条），
 * 却会把 "place" 匹配到 "Placeholder"、把 "rename" 匹配到「眩晕手雷」，
 * 且多 9KB 依赖。排序才是真正缺的东西。
 */

/** 分数越小越靠前 */
function scoreOf(cmd: Command, term: string): number | null {
  const name = cmd.name.toLowerCase()
  // 去掉开头的 / 再比，这样搜 "map" 能命中 /map
  const bare = cmd.command.toLowerCase().replace(/^\//, '')

  const ni = name.indexOf(term)
  const ci = bare.indexOf(term)
  if (ni < 0 && ci < 0) return null

  let score: number
  if (bare === term) score = 0            // 指令本身，如 map -> /map
  else if (name === term) score = 1       // 名称完全相同
  else if (ci === 0) score = 10           // 指令前缀，如 map -> /map clear
  else if (ni === 0) score = 20           // 名称前缀
  else if (ni > 0) score = 40 + Math.min(ni, 20)  // 名称中间，越靠前越优先
  else score = 70 + Math.min(ci, 20)      // 只在指令参数里命中

  // 同分时短名优先：「雕像」应排在「能量雕像999%」前面
  return score + Math.min(cmd.name.length, 60) / 1000
}

export function searchCommands(query: string, category: string): Command[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const pool =
    category === 'all'
      ? commands
      : commands.filter((c) => c.category === category)

  if (terms.length === 0) return pool

  const hits: { cmd: Command; score: number }[] = []
  for (const cmd of pool) {
    // 多个关键词要全部命中（AND），便于「place 建筑」这类收敛
    let best: number | null = null
    let allMatched = true
    for (const term of terms) {
      const s = scoreOf(cmd, term)
      if (s === null) {
        allMatched = false
        break
      }
      if (best === null || s < best) best = s
    }
    if (allMatched && best !== null) hits.push({ cmd, score: best })
  }

  hits.sort((a, b) => a.score - b.score)
  return hits.map((h) => h.cmd)
}
