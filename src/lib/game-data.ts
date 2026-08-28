/**
 * 游戏数据字典 —— 建筑/资源 ID 反查名称。
 *
 * `/api/home/{id}` 返回的 buildings[].data 是全局 ID，这里用
 * src/lib/generated/entities.ts 反查。那份表由 scripts/gen-entities.mjs
 * 从游戏自带 CSV 生成，改名去改 src/data/entity-name-overrides.json。
 *
 * 以前这里是从 commands.json 的 `/place 1 1 1000000 1` 那批预展开指令里
 * 正则抠名字。顺带说明：旧注释说 commands.json 的资源 3 与 4 写反了，
 * 那个已经在 b1caf9d4 修掉，现在两边都以 CSV 为准，不再各写一份。
 */

import { ENTITY_TABLES } from '@/lib/generated/entities'

/** 司令部 */
export const HQ_BUILDING_ID = 1000000

/** 全局 ID → 名称。建筑/障碍物/地雷/装饰都可能出现在基地里 */
let placeNameMap: Map<number, { zh: string; en: string }> | null = null

function getPlaceNameMap() {
  if (placeNameMap) return placeNameMap
  const map = new Map<number, { zh: string; en: string }>()
  // 与旧实现一致：先到先得，不覆盖
  for (const id of ['building', 'obstacle', 'trap', 'deco'] as const) {
    for (const o of ENTITY_TABLES[id]?.options ?? []) {
      const n = Number(o.value)
      if (!map.has(n)) map.set(n, { zh: o.zh, en: o.en })
    }
  }
  placeNameMap = map
  return map
}

/** 取建筑名称；未收录时回落到 `#ID` */
export function buildingName(id: number, locale = 'zh'): string {
  const hit = getPlaceNameMap().get(id)
  if (!hit) return `#${id}`
  return locale === 'en' ? hit.en : hit.zh
}

/**
 * 资源 ID → 名称。传进来的是全局 ID（3000000+序号），
 * 而实体表里资源存的是裸序号，所以要先减掉类型前缀。
 */
export function resourceName(id: number, locale: string): string | null {
  const instance = id - 3000000
  if (instance < 0) return null
  const hit = ENTITY_TABLES.resource?.options.find((o) => o.value === String(instance))
  if (!hit) return null
  return locale === 'en' ? hit.en : hit.zh
}

export const MAIN_RESOURCE_IDS = [3000001, 3000002, 3000003, 3000004]
