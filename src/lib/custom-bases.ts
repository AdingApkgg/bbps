/** 自制基地的展示辅助 */

import { LAYOUT_OPTIONS } from '@/lib/layouts'
import type { Locale } from '@/lib/i18n'

/**
 * 关卡类型 → 显示名。
 *
 * 名字复用 LAYOUT_OPTIONS —— 那份取自游戏自带本地化表 texts.csv 的 TID_LAYOUT_*，
 * 是玩家在游戏里看到的字。这里刻意不另抄一份：commands-data.ts 的注释记着上次
 * 手抄的结果，enemybase 被写成「恐怖博士的火山岛」，和游戏各说各话。
 *
 * LAYOUT_OPTIONS 的标签带「(原始值)」后缀，那是给指令面板的（用户要照着输入），
 * 表格和筛选下拉里是噪音，剥掉。
 */
const LEVEL_NAMES = new Map(
  LAYOUT_OPTIONS.map((o) => [
    o.value,
    {
      zh: o.labelZh.replace(` (${o.value})`, ''),
      en: o.labelEn.replace(` (${o.value})`, '')
    }
  ])
)

/**
 * 线上有极少量脏值，例如把整个文件路径存了进来的 `layout/enemybase.level`。
 * 取基名、去掉 .level 后缀再查表，能把它们归回正确的类型。
 */
export function normalizeBaseLevel(level: string): string {
  return level.replace(/^.*\//, '').replace(/\.level$/i, '')
}

/**
 * `null` 是「没有类型」—— 列表项里是 null，facets 里是空串，同一回事。
 * 查不到的值原样显示：服务端随时可能加新关卡，宁可露出原文也不要吞掉信息。
 */
export function baseLevelLabel(
  level: string | null,
  locale: Locale,
  uncategorized: string
): string {
  if (!level) return uncategorized
  return LEVEL_NAMES.get(normalizeBaseLevel(level))?.[locale] ?? level
}
