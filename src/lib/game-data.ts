/**
 * 游戏数据字典 —— 从已有的 commands.json 反查建筑/资源名称。
 *
 * `/api/home/{id}` 返回的 buildings[].data 是建筑 ID，
 * 而 commands.json 里 `/place 1 1 1000000 1` 就带着「司令部(Headquarters)」这种名字，
 * 直接复用，不再单独维护一份表。
 */

import commandsJson from '@/data/commands.json'

/** 司令部 */
export const HQ_BUILDING_ID = 1000000

/** 建筑/装饰 ID → 名称（懒初始化，只建一次） */
let placeNameMap: Map<number, string> | null = null

function getPlaceNameMap(): Map<number, string> {
  if (placeNameMap) return placeNameMap
  const map = new Map<number, string>()
  for (const cmd of commandsJson.commands) {
    const m = cmd.command.match(/^\/place\s+\S+\s+\S+\s+(\d{7,8})/)
    if (m) {
      const id = Number(m[1])
      if (!map.has(id)) map.set(id, cmd.name)
    }
  }
  placeNameMap = map
  return map
}

/** 取建筑名称；未收录时回落到 `#ID` */
export function buildingName(id: number): string {
  return getPlaceNameMap().get(id) ?? `#${id}`
}

/** 资源 ID → 名称，对应 `/resource <n>` 的编号 */
/**
 * 名称取自 Gamefiles/csv/resources.csv 的 TID 在 texts.csv 的官方译名。
 * 注意 3 与 4：官方是 3=石材(Stone)、4=钢材(Iron)，
 * 而 data/commands.json 里这两条写反了，别照抄那边。
 */
const RESOURCE_NAMES: Record<number, { zh: string; en: string }> = {
  3000000: { zh: '钻石', en: 'Diamonds' },
  3000001: { zh: '黄金', en: 'Gold' },
  3000002: { zh: '木材', en: 'Wood' },
  3000003: { zh: '石材', en: 'Stone' },
  3000004: { zh: '钢材', en: 'Iron' }
}

export function resourceName(id: number, locale: string): string | null {
  const entry = RESOURCE_NAMES[id]
  if (!entry) return null
  return locale === 'en' ? entry.en : entry.zh
}

export const MAIN_RESOURCE_IDS = [3000001, 3000002, 3000003, 3000004]
