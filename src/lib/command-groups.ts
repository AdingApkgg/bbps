import { categories, commands, type Command } from '@/lib/commands-data'
import {
  displayName,
  matchFamily,
  type CommandFamily
} from '@/lib/command-families'

/**
 * 把「同一条指令的 ID 排列」折叠成一行 + 实体下拉框。
 *
 * 折叠必须按「家族 × 分类」分组：place-deco 横跨 地雷/障碍物/Trophy，
 * getstatue 横跨 common/雕像，只按家族折叠会让分类筛选串味。
 * 项数太少的组（如地雷 3 条）折叠反而更难用，保持独立行。
 */
const MIN_GROUP_SIZE = 6

export interface CommandGroup {
  id: string
  family: CommandFamily
  category: string
  options: Command[]
  /** 展示名；同一家族横跨多个分类时会带上分类名消歧 */
  labelZh: string
  labelEn: string
}

export type ListEntry =
  | { kind: 'single'; cmd: Command }
  | { kind: 'group'; group: CommandGroup; matched: Command[] }

/* 构建一次，模块级缓存 */
const groups: CommandGroup[] = []
const singles: Command[] = []

{
  const buckets = new Map<string, { family: CommandFamily; items: Command[] }>()
  const order: string[] = []

  for (const cmd of commands) {
    const family = matchFamily(cmd.command)
    if (!family) {
      singles.push(cmd)
      continue
    }
    const key = `${family.id}::${cmd.category}`
    if (!buckets.has(key)) {
      buckets.set(key, { family, items: [] })
      order.push(key)
    }
    buckets.get(key)!.items.push(cmd)
  }

  for (const key of order) {
    const { family, items } = buckets.get(key)!
    if (items.length < MIN_GROUP_SIZE) {
      singles.push(...items)
      continue
    }
    groups.push({
      id: key,
      family,
      category: items[0].category,
      options: items,
      labelZh: family.labelZh,
      labelEn: family.labelEn
    })
  }

  // place-deco 同时产出「障碍物」和「奖杯」两组，光看家族名分不出来，补上分类名
  const byLabel = new Map<string, CommandGroup[]>()
  for (const g of groups) {
    const list = byLabel.get(g.family.id) ?? []
    list.push(g)
    byLabel.set(g.family.id, list)
  }
  for (const list of byLabel.values()) {
    if (list.length < 2) continue
    for (const g of list) {
      const cat = categories.find((c) => c.id === g.category)
      if (!cat) continue
      g.labelZh = cat.nameZh
      g.labelEn = cat.nameEn
    }
  }
}

export const COMMAND_GROUPS = groups

/** 下拉框里显示的实体名，剥掉写死的数值 */
export function optionLabel(cmd: Command, family: CommandFamily): string {
  return displayName(cmd.name, family)
}

/* ---------- 搜索 ---------- */

function scoreOf(cmd: Command, term: string): number | null {
  const name = cmd.name.toLowerCase()
  const bare = cmd.command.toLowerCase().replace(/^\//, '')
  const ni = name.indexOf(term)
  const ci = bare.indexOf(term)
  if (ni < 0 && ci < 0) return null

  let score: number
  if (bare === term) score = 0
  else if (name === term) score = 1
  else if (ci === 0) score = 10
  else if (ni === 0) score = 20
  else if (ni > 0) score = 40 + Math.min(ni, 20)
  else score = 70 + Math.min(ci, 20)
  return score + Math.min(cmd.name.length, 60) / 1000
}

/** 多个关键词要全部命中（AND），返回最优分 */
function scoreAll(cmd: Command, terms: string[]): number | null {
  let best: number | null = null
  for (const term of terms) {
    const s = scoreOf(cmd, term)
    if (s === null) return null
    if (best === null || s < best) best = s
  }
  return best
}

function groupLabels(group: CommandGroup): string[] {
  return [
    group.labelZh,
    group.labelEn,
    group.family.labelZh,
    group.family.labelEn,
    group.category
  ]
}

export function searchEntries(query: string, category: string): ListEntry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const inCategory = (c: string) => category === 'all' || c === category

  const scored: { entry: ListEntry; score: number }[] = []

  for (const cmd of singles) {
    if (!inCategory(cmd.category)) continue
    if (terms.length === 0) {
      scored.push({ entry: { kind: 'single', cmd }, score: 500 })
      continue
    }
    const s = scoreAll(cmd, terms)
    if (s !== null) scored.push({ entry: { kind: 'single', cmd }, score: s })
  }

  for (const group of groups) {
    if (!inCategory(group.category)) continue

    if (terms.length === 0) {
      // 无搜索时把折叠组排在前面，它们是入口
      scored.push({
        entry: { kind: 'group', group, matched: group.options },
        score: 100
      })
      continue
    }

    // 组名命中 → 整组可选；否则按实体名过滤，命中哪些就只留哪些
    const labelHit = terms.every((term) =>
      groupLabels(group).some((l) => l.toLowerCase().includes(term))
    )

    const matched: { cmd: Command; score: number }[] = []
    for (const opt of group.options) {
      const s = scoreAll(opt, terms)
      if (s !== null) matched.push({ cmd: opt, score: s })
    }
    matched.sort((a, b) => a.score - b.score)

    if (matched.length > 0) {
      scored.push({
        entry: { kind: 'group', group, matched: matched.map((m) => m.cmd) },
        score: matched[0].score
      })
    } else if (labelHit) {
      scored.push({
        entry: { kind: 'group', group, matched: group.options },
        score: 30
      })
    }
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.map((s) => s.entry)
}

/** 折叠后条目数，用于文案 */
export function totalEntryCount(): number {
  return singles.length + groups.length
}
