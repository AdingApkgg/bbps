/**
 * 实体参数的下拉取值。
 *
 * 取值来自 src/lib/generated/entities.ts —— 由 scripts/gen-entities.mjs 从
 * 游戏自带 CSV 生成。以前这里是反过来的：拿正则去 commands.json 里那
 * 1004 行预展开指令中把 ID 抠出来，名字也跟着抄一份，于是同一个实体在
 * 「指令库」和「可用指令」两处各有一份名字，改一处另一处不动。
 *
 * 只放 exposed 的取值：CSV 里有 251 个建筑、191 个母舰技能，站点只提供
 * 其中 149 / 34 个，其余是内部条目，不该出现在下拉里。
 *
 * 标签一律带上 ID，因为确实存在重名（迫击炮、加农炮各有两个）。
 */
import { ENTITY_TABLES } from '@/lib/generated/entities'
import type { ParamOption } from '@/lib/commands'

function toOptions(tableId: string): ParamOption[] {
  const t = ENTITY_TABLES[tableId]
  if (!t) return []
  return t.options
    .filter((o) => o.exposed)
    .map((o) => ({
      value: o.value,
      labelZh: `${o.zh} (${o.value})`,
      labelEn: `${o.en} (${o.value})`
    }))
}

/** 部队：/setboat <艇号> <character> <数量> */
export const TROOP_OPTIONS = toOptions('troop')

/** 仅建筑，供 /attackbuilding <building> 用 */
export const BUILDING_OPTIONS = toOptions('building')

/** 可放置对象的全局 ID：建筑 / 障碍物 / 地雷 / 装饰，来自 /place X Y <全局ID> */
export const PLACEABLE_OPTIONS = [
  ...toOptions('building'),
  ...toOptions('obstacle'),
  ...toOptions('trap'),
  ...toOptions('deco')
]

/** 资源：/resource <resource> <数量> */
export const RESOURCE_OPTIONS = toOptions('resource')

/** 母舰技能：/rule spell <spell> */
export const SPELL_OPTIONS = toOptions('spell')

/** 雕刻：/engraving level|quality <雕刻> <值> */
export const ENGRAVING_OPTIONS = toOptions('engraving')

/**
 * 参数名 → 取值表。键用小写比对，兼顾目录里中英混用的参数名。
 * 只收「值是游戏内部 ID」的那些；<数量> <X> <Y> <名字> 这类本就该手填。
 */
export const ENTITY_PARAM_OPTIONS: Record<string, ParamOption[]> = {
  character: TROOP_OPTIONS,
  building: BUILDING_OPTIONS,
  全局id: PLACEABLE_OPTIONS,
  resource: RESOURCE_OPTIONS,
  spell: SPELL_OPTIONS,
  雕刻: ENGRAVING_OPTIONS
}

export function entityOptions(paramName: string): ParamOption[] | null {
  return ENTITY_PARAM_OPTIONS[paramName.toLowerCase()] ?? null
}

/**
 * 实体参数的显示名。目录里的参数名沿用服务端 C# 的形参名（character、
 * spell…），直接摆在表单上等于让人猜；这里只改标签，取值仍是原参数名。
 */
const ENTITY_PARAM_LABELS: Record<string, { zh: string; en: string }> = {
  character: { zh: '部队', en: 'Troop' },
  building: { zh: '建筑', en: 'Building' },
  全局id: { zh: '对象', en: 'Object' },
  resource: { zh: '资源', en: 'Resource' },
  spell: { zh: '母舰技能', en: 'Warship skill' }
}

export function entityParamLabel(paramName: string, locale: string): string | null {
  const hit = ENTITY_PARAM_LABELS[paramName.toLowerCase()]
  if (!hit) return null
  return locale === 'en' ? hit.en : hit.zh
}
