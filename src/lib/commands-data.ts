/**
 * 「指令库」的数据源 —— 合成的，不再有 src/data/commands.json 那 6106 行。
 *
 * 四个来源，每个事实只存一处：
 *   实体类指令  ENTITY_TABLES（scripts/gen-entities.mjs 从游戏 CSV 生成）× ENTITY_SHAPES
 *   普通指令    COMMAND_CATALOG（逐条核过服务端 C# 注册的目录）
 *   彩色字体    COLOR_TAGS
 *   遗留条目    LEGACY_COMMANDS（前三者产不出的，含服务端未注册的死指令）
 *
 * 旧的那份 JSON 把「指令形态 × 实体表」预先乘开成 1004 行，于是每个实体名
 * 被手抄一遍、跟游戏本地化各走各的（enemybase 一度写成「恐怖博士的火山岛」，
 * 游戏里叫「黑暗卫队头目岛」），还得再写一套正则把它反推回下拉框。
 *
 * 只取 exposed 的实体：CSV 里有 251 个建筑、191 个母舰技能，站点只提供
 * 其中 149 / 34 个，其余是内部条目。
 */
import { ENTITY_TABLES } from '@/lib/generated/entities'
import { COMMAND_CATALOG } from '@/lib/commands'
import { COLOR_TAGS, colorSnippet } from '@/data/color-tags'
import { LEGACY_COMMANDS } from '@/data/legacy-commands'

export interface Command {
  id: string
  name: string
  command: string
  category: string
  /** 别名要参与搜索：搜 /bb 得能搜到 /basebuilder */
  aliases?: string[]
  /** 服务端未注册，只给复制不给执行 */
  copyOnly?: boolean
}

export interface CommandCategory {
  id: string
  nameZh: string
  nameEn: string
}

export const categories: CommandCategory[] = [
  { id: 'common', nameZh: '常用命令', nameEn: 'Common' },
  { id: '雕像', nameZh: '雕像命令', nameEn: 'Statue' },
  { id: '雕刻', nameZh: '雕刻命令', nameEn: 'Engraving' },
  { id: 'troop', nameZh: '部队命令', nameEn: 'Troop' },
  { id: 'building', nameZh: '建筑命令', nameEn: 'Building' },
  { id: '地雷', nameZh: '地雷命令', nameEn: 'Mine' },
  { id: '障碍物', nameZh: '放置树/石头命令', nameEn: 'Decoration' },
  { id: '资源', nameZh: '获取资源指令', nameEn: 'Resource' },
  { id: 'Trophy', nameZh: '奖杯', nameEn: 'Trophy' },
  { id: 'warshipSkill', nameZh: '战舰技能', nameEn: 'Warship Skill' },
  { id: '特遣队', nameZh: '特遣队指令', nameEn: 'Task Force' },
  { id: '全部', nameZh: '指令总览', nameEn: 'Reference' },
  { id: 'colorfulText', nameZh: '彩色字体', nameEn: 'Colored Text' },
  { id: 'calculator', nameZh: '螃蟹甲板', nameEn: 'Crab Deck' }
]

/**
 * 实体类指令的模板，`%s` 是实体取值的位置。
 * 默认值（数量 1、等级 1、坐标 1 1）沿用旧数据的写法，行内数值框可改。
 */
const ENTITY_SHAPES: { table: string; category: string; template: string }[] = [
  { table: 'resource', category: '资源', template: '/resource %s 9999999' },
  { table: 'troop', category: 'troop', template: '/setboat 1 %s 1' },
  { table: 'building', category: 'building', template: '/place 1 1 %s 1' },
  { table: 'trap', category: '地雷', template: '/place 1 1 %s' },
  { table: 'obstacle', category: '障碍物', template: '/place 1 1 %s' },
  { table: 'deco', category: 'Trophy', template: '/place 0 0 %s' },
  { table: 'spell', category: 'warshipSkill', template: '/spell add %s' },
  { table: 'engraving', category: '雕刻', template: '/engraving level %s 0' },
  { table: 'engraving', category: '雕刻', template: '/engraving quality %s 0' },
  { table: 'layout', category: 'common', template: '/layout %s' }
]

/** 与旧数据一致：展示名写成「中文(English)」，中英同名时只写一个 */
function displayName(zh: string, en: string): string {
  return zh && en && zh !== en ? `${zh}(${en})` : zh || en
}

function entityCommands(): Command[] {
  const out: Command[] = []
  for (const shape of ENTITY_SHAPES) {
    const table = ENTITY_TABLES[shape.table]
    if (!table) continue
    // 雕刻有等级/品质两个模板，用模板动词区分 id
    const slug = shape.template.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '')
    for (const o of table.options) {
      if (!o.exposed) continue
      out.push({
        id: `${shape.table}-${slug}-${o.value}`,
        name: displayName(o.zh, o.en),
        command: shape.template.replace('%s', o.value),
        category: shape.category
      })
    }
  }
  return out
}

/** 目录条目按它在「可用指令」里的分组落到指令库的分类 */
const GROUP_TO_CATEGORY: Record<string, string> = {
  rescue: 'common',
  basic: 'common',
  resource: '资源',
  home: 'common',
  map: '特遣队',
  battle: '全部',
  debug: '全部',
  admin: '全部'
}

function catalogCommands(): Command[] {
  return COMMAND_CATALOG.map((c) => ({
    id: `catalog-${c.cmd.replace(/[^a-z0-9]+/gi, '-')}`,
    name: c.desc,
    command: c.syntax,
    category: GROUP_TO_CATEGORY[c.group] ?? '全部',
    aliases: c.aliases,
    // 只能在游戏里发或只走高级模式的，网页不给执行按钮
    copyOnly: c.inGameOnly || c.advancedOnly || undefined
  }))
}

function colorCommands(): Command[] {
  return COLOR_TAGS.map((t) => ({
    id: `color-${t.hex}`,
    name: `${t.zh}(${t.hex})`,
    command: colorSnippet(t),
    category: 'colorfulText'
  }))
}

function legacyCommands(): Command[] {
  return LEGACY_COMMANDS.map((c, i) => ({
    id: `legacy-${i}`,
    name: c.name,
    command: c.command,
    category: c.category,
    copyOnly: c.copyOnly
  }))
}

export const commands: Command[] = [
  ...catalogCommands(),
  ...entityCommands(),
  ...legacyCommands(),
  ...colorCommands()
]
