/**
 * 可用指令目录 —— 唯一真值是服务端 HBCheat 源码，非 docs/HBCheat帮助.md（已过期）。
 *
 * 注意与 lib/commands-data.ts 区分：
 *   - 本文件：指令「定义」——语法、别名、分组、权限、危险级别，约 150 条
 *   - commands-data.ts：指令「实例」——由 data/commands.json 提供的
 *     /place 1 1 1000000 1 这类填好 ID 的具体可用指令，约 1000 条
 *
 * 服务端新增指令时只改这一个文件。
 */

export type CommandGroupId =
  | 'rescue'
  | 'basic'
  | 'battle'
  | 'resource'
  | 'home'
  | 'map'
  | 'debug'
  | 'admin'

/** destructive = 毁掉现有进度且不可撤销，需二次确认；warn = 大幅改动存档，需一次确认 */
export type DangerLevel = 'warn' | 'destructive'

export interface CatalogCommand {
  /** 主指令名，带 / */
  cmd: string
  /** 完整语法，带 / 与参数占位符 */
  syntax: string
  aliases: string[]
  group: CommandGroupId
  admin: boolean
  danger?: DangerLevel
  /** 查询类：结果只发到游戏内，网页什么都看不到 */
  queryOnly?: boolean
  /** 需要玩家处在自己的家园（不在战斗/访问中） */
  needsHome?: boolean
  /** 不做成按钮，只留给高级模式自由输入 */
  advancedOnly?: boolean
  /** 只能在游戏里打，网页上仅作说明 */
  inGameOnly?: boolean
  /** 按参数名提供固定取值，渲染成下拉；键要与 syntax 里的占位符同名 */
  paramOptions?: Record<string, ParamOption[]>
  desc: string
}

export interface ParamOption {
  value: string
  labelZh: string
  labelEn: string
}

export interface CommandGroupMeta {
  id: CommandGroupId
  labelZh: string
  labelEn: string
  /** 分组说明，会显示在标题下 */
  noteZh?: string
  noteEn?: string
  /** 默认折叠 */
  collapsed?: boolean
}

export const COMMAND_GROUP_META: CommandGroupMeta[] = [
  {
    id: 'rescue',
    labelZh: '闪退自救',
    labelEn: 'Crash rescue',
    noteZh: '游戏点开某个界面就闪退时，先试这里',
    noteEn: 'Try these first if the game crashes when opening a screen'
  },
  { id: 'basic', labelZh: '基础', labelEn: 'Basics' },
  { id: 'battle', labelZh: '进攻 / 侦察 / 回放', labelEn: 'Attack / Scout / Replay' },
  { id: 'resource', labelZh: '资源与账号', labelEn: 'Resources & account' },
  { id: 'home', labelZh: '部队与基地', labelEn: 'Troops & base' },
  { id: 'map', labelZh: '地图 / 特遣队 / 母舰', labelEn: 'Map / Task force / Warship' },
  {
    id: 'debug',
    labelZh: '调试',
    labelEn: 'Debug',
    noteZh: '多为查询类，结果只在游戏内可见',
    noteEn: 'Mostly queries — results appear in game only',
    collapsed: true
  },
  {
    id: 'admin',
    labelZh: '管理员',
    labelEn: 'Admin',
    noteZh: '需要管理员权限，普通玩家执行会返回失败（与拼错指令同一个错误码，无法区分）',
    noteEn: 'Requires admin. Regular players get a failure — the same code as a typo, indistinguishable.',
    collapsed: true
  }
]

/**
 * /getstatue 的取值，全部取自游戏自带数据，不自拟名称：
 *   神像 = buildings.csv 中 BuildingClass == "Artifact" 的具名实例序号，
 *          名称取其 TID 在 texts.csv 的 EN / ZH-HANS；
 *          四种元素共用同一套稀有度名（小巧/精良/极品），
 *          故用 artifacts.csv 的 ArtifactType 配合
 *          TID_ARTIFACT_TYPE_HINT_1..4 的元素名（生命/寒冰/熔岩/暗黑）区分。
 *          注意内部名是 Fire，游戏里显示为「熔岩 / Magma」。
 *   加成 = artifact_bonuses.csv 的行序，名称取其 TID 的官方译名。
 * 旧文档写的「蓝30」有误：实例 30 是 Boss Mortar，并非神像。
 */
export const ARTIFACT_OPTIONS: ParamOption[] = [
  { value: '12', labelZh: '生命小巧神像 (12)', labelEn: 'Life Idol (12)' },
  { value: '13', labelZh: '生命精良神像 (13)', labelEn: 'Life Guardian (13)' },
  { value: '14', labelZh: '生命极品神像 (14)', labelEn: 'Life Masterpiece (14)' },
  { value: '39', labelZh: '寒冰小巧神像 (39)', labelEn: 'Ice Idol (39)' },
  { value: '40', labelZh: '寒冰精良神像 (40)', labelEn: 'Ice Guardian (40)' },
  { value: '41', labelZh: '寒冰极品神像 (41)', labelEn: 'Ice Masterpiece (41)' },
  { value: '42', labelZh: '熔岩小巧神像 (42)', labelEn: 'Magma Idol (42)' },
  { value: '43', labelZh: '熔岩精良神像 (43)', labelEn: 'Magma Guardian (43)' },
  { value: '44', labelZh: '熔岩极品神像 (44)', labelEn: 'Magma Masterpiece (44)' },
  { value: '45', labelZh: '暗黑小巧神像 (45)', labelEn: 'Dark Idol (45)' },
  { value: '46', labelZh: '暗黑精良神像 (46)', labelEn: 'Dark Guardian (46)' },
  { value: '47', labelZh: '暗黑极品神像 (47)', labelEn: 'Dark Masterpiece (47)' }
]

export const ARTIFACT_BONUS_OPTIONS: ParamOption[] = [
  { value: '0', labelZh: '黄金产量 (0)', labelEn: 'Gold production (0)' },
  { value: '1', labelZh: '木材产量 (1)', labelEn: 'Wood production (1)' },
  { value: '2', labelZh: '石材产量 (2)', labelEn: 'Stone production (2)' },
  { value: '3', labelZh: '钢材产量 (3)', labelEn: 'Iron production (3)' },
  { value: '4', labelZh: '部队生命值 (4)', labelEn: 'Troop health (4)' },
  { value: '5', labelZh: '建筑生命值 (5)', labelEn: 'Building health (5)' },
  { value: '6', labelZh: '部队伤害输出 (6)', labelEn: 'Troop damage (6)' },
  { value: '7', labelZh: '建筑伤害输出 (7)', labelEn: 'Building damage (7)' },
  { value: '8', labelZh: '战舰能量 (8)', labelEn: 'Gunboat energy (8)' },
  { value: '9', labelZh: '资源奖励 (9)', labelEn: 'Resource reward (9)' },
  { value: '10', labelZh: '能量水晶掉落几率 (10)', labelEn: 'Power Stone chance (10)' },
  { value: '11', labelZh: '资源产量 (11)', labelEn: 'Resource production (11)' }
]

/**
 * <layout> 取值 —— 12 个生效值取自 HBCheatManager.LAYOUT_NAMES。
 *
 * 中英文名直接用游戏自带的本地化表 Gamefiles/csv/texts.csv 的
 * TID_LAYOUT_*（EN 与 ZH-HANS 两列），玩家在游戏里看到的就是这些字，
 * 不另起译名。括号里保留原始值，那才是实际要输入的东西。
 */
export const LAYOUT_OPTIONS: ParamOption[] = [
  { value: 'playerbase', labelZh: '玩家岛 (playerbase)', labelEn: 'Playerbase (playerbase)' },
  { value: 'enemybase', labelZh: '黑暗卫队头目岛 (enemybase)', labelEn: 'Enemybase (enemybase)' },
  { value: 'small_a', labelZh: '袖珍岛 (small_a)', labelEn: 'Small A (small_a)' },
  { value: 'small_b', labelZh: '摩斯海德岛 (small_b)', labelEn: 'Small B (small_b)' },
  { value: 'mainland_a', labelZh: '绝岭雄风海湾 (mainland_a)', labelEn: 'Mainland A (mainland_a)' },
  { value: 'mainland_b', labelZh: '帕彻斯奥半岛 (mainland_b)', labelEn: 'Mainland B (mainland_b)' },
  { value: 'med_a', labelZh: '双子珊瑚岛 (med_a)', labelEn: 'Med A (med_a)' },
  { value: 'factory', labelZh: '任务工厂 (factory)', labelEn: 'Power Factory (factory)' },
  { value: 'harbor', labelZh: '任务海港 (harbor)', labelEn: 'Power Harbor (harbor)' },
  { value: 'octobase', labelZh: '超级螃蟹 (octobase)', labelEn: 'Mega Crab (octobase)' },
  { value: 'turtlebase', labelZh: '超级海龟 (turtlebase)', labelEn: 'Mega Turtle (turtlebase)' },
  { value: 'warship', labelZh: '战斗母舰 (warship)', labelEn: 'Warship (warship)' }
]

export const LAYOUT_VALUES = LAYOUT_OPTIONS.map((o) => o.value)

/** 参数写法提示，按参数名匹配（小写包含） */
export const PARAM_HINTS: { match: string; zh: string; en: string }[] = [
  {
    match: 'player',
    zh: '18 玩家ID · #2PP 玩家标签（带#）· [23,19] 多个ID · "Alice" 玩家名（半角双引号，同名全命中）',
    en: '18 player ID · #2PP tag (with #) · [23,19] multiple IDs · "Alice" name (double quotes, matches all)'
  },
  {
    match: 'character',
    zh: '[Tank] 数据名 · <步兵> 中文名 · 4 实例ID · 4000001 全局ID',
    en: '[Tank] data name · <中文名> · 4 instance ID · 4000001 global ID'
  },
  {
    match: 'resource',
    zh: '[Gold] 数据名 · <金币> 中文名 · 1 实例ID · 3000001 全局ID',
    en: '[Gold] data name · <中文名> · 1 instance ID · 3000001 global ID'
  },
  {
    match: '全局id',
    zh: 'TRAP:Mine · buildings[HQ] · 3000001 全局ID（此处不能用裸实例ID）',
    en: 'TRAP:Mine · buildings[HQ] · 3000001 global ID (bare instance IDs not allowed here)'
  },
  {
    match: 'layout',
    zh: '岛屿类型，共 12 种，见下拉',
    en: 'Island layout — 12 options, see dropdown'
  }
]

export function paramHint(name: string, locale: string): string | null {
  const n = name.toLowerCase()
  const hit = PARAM_HINTS.find((h) => n.includes(h.match))
  if (!hit) return null
  return locale === 'en' ? hit.en : hit.zh
}

/* ── 指令目录 ── */

const C = (c: Omit<CatalogCommand, 'aliases' | 'admin'> &
  Partial<Pick<CatalogCommand, 'aliases' | 'admin'>>): CatalogCommand => ({
  aliases: [],
  admin: false,
  ...c
})

export const COMMAND_CATALOG: CatalogCommand[] = [
  /* ── 闪退自救 ── */
  C({ cmd: '/log attack clear', syntax: '/log attack clear', group: 'rescue',
      desc: '进攻日志闪退时清空进攻日志' }),
  C({ cmd: '/log activity clear', syntax: '/log activity clear', group: 'rescue',
      desc: '活动日志闪退时清空活动日志' }),
  C({ cmd: '/map deepsea reset', syntax: '/map deepsea reset', group: 'rescue',
      desc: '点潜水艇闪退时重置潜水艇' }),
  C({ cmd: '/cleararts', syntax: '/cleararts <player>', group: 'rescue', admin: true,
      desc: '神庙闪退时清除神像，需要管理员执行' }),
  C({ cmd: '/clearshields', syntax: '/clearshields <player>', group: 'rescue', admin: true,
      desc: '护盾闪退时清除护盾发生器，需要管理员执行' }),

  /* ── 基础 ── */
  C({ cmd: '/webcode', syntax: '/webcode', group: 'basic', inGameOnly: true,
      desc: '索取网页验证码。只能在游戏聊天框里打，网页上无法代劳' }),
  C({ cmd: '/help', syntax: '/help [<指令名>]', group: 'basic', queryOnly: true,
      desc: '列出全部指令用法，或某一条指令的用法' }),
  C({ cmd: '/me', syntax: '/me', aliases: ['/whoami'], group: 'basic', queryOnly: true,
      desc: '查看当前账号信息' }),
  C({ cmd: '/test', syntax: '/test', group: 'basic',
      desc: '回一句 hello, world!，用来确认通道是否正常' }),
  C({ cmd: '/olp', syntax: '/olp', group: 'basic', queryOnly: true,
      desc: '全服在线玩家列表' }),
  C({ cmd: '/say', syntax: '/say <文本>', aliases: ['/broadcast'], group: 'basic',
      desc: '发一条全服聊天，等价于直接说话' }),
  C({ cmd: '/msg', syntax: '/msg <player> <文本>', aliases: ['/tell', '/w'], group: 'basic',
      desc: '私聊指定玩家' }),
  C({ cmd: '/findacc', syntax: '/findacc [<player>]', aliases: ['/findaccount'], group: 'basic',
      desc: '账号找回流程' }),
  C({ cmd: '/bebean', syntax: '/bebean', aliases: ['/Bebean', '/bot', '/robot'], group: 'basic',
      desc: '介绍本服机器人 Bebean' }),
  C({ cmd: '/utc', syntax: '/utc', aliases: ['/UTC'], group: 'basic',
      desc: '介绍 UTC 时间' }),
  C({ cmd: '/log activity', syntax: '/log activity <summary|invade|deepsea|event|enemy>', group: 'basic',
      desc: '按类型查看活动日志' }),
  C({ cmd: '/log notice', syntax: '/log notice <clear|custom|gem|chest>', group: 'basic',
      desc: '通知日志：清空或插入一条测试通知' }),
  C({ cmd: '/log notice resource', syntax: '/log notice <resource> <数量>', group: 'basic',
      desc: '插入一条资源变动通知' }),
  C({ cmd: '/log warship clear', syntax: '/log warship clear', group: 'basic',
      desc: '清空战斗母舰日志' }),

  /* ── 进攻 / 侦察 / 回放 ── */
  C({ cmd: '/attackplayer', syntax: '/attackplayer [<player>]', aliases: ['/attackp', '/atkp'],
      group: 'battle', desc: '进攻某玩家的岛屿，留空则打自己' }),
  C({ cmd: '/visitplayer', syntax: '/visitplayer [<player>]',
      aliases: ['/visitp', '/scoutplayer', '/scoutp'], group: 'battle',
      desc: '侦察某玩家的岛屿，留空则看自己' }),
  C({ cmd: '/attackwarship', syntax: '/attackwarship [<player>]', aliases: ['/attackw', '/atkw'],
      group: 'battle', desc: '进攻战斗母舰基地' }),
  C({ cmd: '/visitwarship', syntax: '/visitwarship [<player>]',
      aliases: ['/visitw', '/scoutwarship', '/scoutw'], group: 'battle',
      desc: '侦察战斗母舰基地' }),
  C({ cmd: '/atkpr', syntax: '/atkpr', group: 'battle',
      desc: '随机挑一个已缓存的玩家来打' }),
  C({ cmd: '/replay', syntax: '/replay [<回放ID>]', group: 'battle',
      desc: '播放回放；填 count 可查全服回放数量' }),
  C({ cmd: '/live', syntax: '/live <player>', group: 'battle',
      desc: '观看指定玩家的战斗直播，对方不在战斗中则失败' }),
  C({ cmd: '/homege', syntax: '/homege <layout> <难度>', group: 'battle',
      desc: '用主基地生成器随机生成一个基地给你打' }),
  C({ cmd: '/homege2', syntax: '/homege2 <layout> <难度>', group: 'battle',
      desc: '同 /homege，但改为侦察' }),
  C({ cmd: '/attackbuilding', syntax: '/attackbuilding <building>', aliases: ['/atkbd'],
      group: 'battle', desc: '生成一个铺满同种建筑的基地给你打' }),
  C({ cmd: '/basebuilder', syntax: '/basebuilder <名字>', aliases: ['/bb'], group: 'battle',
      desc: '进攻基地编辑器做的基地' }),
  C({ cmd: '/basebuilder2', syntax: '/basebuilder2 <名字>', aliases: ['/bb2'], group: 'battle',
      desc: '侦察基地编辑器做的基地' }),
  C({ cmd: '/defend', syntax: '/defend', group: 'battle',
      desc: '读取服务端 defense_editor.xlsx，给你的基地布防' }),
  C({ cmd: '/newdef', syntax: '/newdef <难度>', group: 'battle',
      desc: '新版防御哈莫曼' }),
  C({ cmd: '/sandbox', syntax: '/sandbox', group: 'battle',
      desc: '加载服务端 Gamefiles/level/sandbox.json 沙盒' }),
  C({ cmd: '/attacklevel', syntax: '/attacklevel <layout> <路径>', aliases: ['/atklvl'],
      group: 'battle', advancedOnly: true,
      desc: '进攻服务端指定 JSON 基地。路径是服务端本地路径，玩家基本用不上' }),
  C({ cmd: '/visitlevel', syntax: '/visitlevel <layout> <路径>', aliases: ['/scoutlevel'],
      group: 'battle', advancedOnly: true,
      desc: '同 /attacklevel，但改为侦察' }),

  /* ── 资源与账号 ── */
  C({ cmd: '/resource', syntax: '/resource <resource> <数量>', aliases: ['/res'],
      group: 'resource', desc: '给予指定资源' }),
  C({ cmd: '/resource fill', syntax: '/resource fill', group: 'resource',
      desc: '给予大部分常用资源' }),
  C({ cmd: '/resource proto', syntax: '/resource proto', group: 'resource',
      desc: '给予原型模块' }),
  C({ cmd: '/resource artifact', syntax: '/resource artifact', group: 'resource',
      desc: '给予神庙物品' }),
  C({ cmd: '/resource magic', syntax: '/resource magic', group: 'resource',
      desc: '给予魔法物品' }),
  C({ cmd: '/resource clear', syntax: '/resource clear', group: 'resource', danger: 'destructive',
      desc: '清空全部资源' }),
  C({ cmd: '/experience', syntax: '/experience <等级> [<剩余经验>]', aliases: ['/xp'],
      group: 'resource', desc: '设置经验等级' }),
  C({ cmd: '/research', syntax: '/research <大本等级>', group: 'resource',
      desc: '把科技升到指定大本等级，不含英雄技能' }),
  C({ cmd: '/rename', syntax: '/rename <新名字>', group: 'resource', danger: 'warn',
      desc: '修改玩家名字' }),
  C({ cmd: '/upgrade', syntax: '/upgrade', group: 'resource', danger: 'warn', needsHome: true,
      desc: '把所有建筑升到满级，仅主基地可用' }),
  C({ cmd: '/clearlevel', syntax: '/clearlevel', group: 'resource', danger: 'destructive',
      desc: '把兵种、战舰能力、陷阱全部降到 1 级' }),
  C({ cmd: '/easy', syntax: '/easy', group: 'resource', danger: 'warn',
      desc: '把自己的基地设成全满基地' }),
  C({ cmd: '/tsarbomba', syntax: '/tsarbomba', group: 'resource', danger: 'destructive',
      desc: '清空自己的基地' }),
  C({ cmd: '/startinghome', syntax: '/startinghome', group: 'resource', danger: 'destructive',
      desc: '重置为初始基地' }),
  C({ cmd: '/clearobstacles', syntax: '/clearobstacles', group: 'resource',
      desc: '移除岛上所有障碍物' }),
  C({ cmd: '/unboost', syntax: '/unboost', group: 'resource', needsHome: true,
      desc: '让所有神像加成立即过期' }),

  /* ── 部队与基地 ── */
  C({ cmd: '/setboat', syntax: '/setboat <艇号> <character> <数量>', group: 'home',
      desc: '设置登陆艇兵种，艇号 0-7，例如 /setboat 0 [Rifleman] 50' }),
  C({ cmd: '/setboat fix_pos', syntax: '/setboat fix_pos', group: 'home', needsHome: true,
      desc: '修正部队存储位置异常' }),
  C({ cmd: '/troopcount', syntax: '/troopcount <数量>', group: 'home',
      desc: '修改每艘登陆艇的部队数量' }),
  C({ cmd: '/cleartroops', syntax: '/cleartroops', group: 'home', danger: 'warn',
      desc: '清空所有登陆艇' }),
  C({ cmd: '/bunker set', syntax: '/bunker <序号> set <character> <数量>', group: 'home',
      desc: '设置地堡部队' }),
  C({ cmd: '/bunker clear', syntax: '/bunker <序号> clear', group: 'home',
      desc: '清空指定地堡' }),
  C({ cmd: '/layout', syntax: '/layout [<layout>]', group: 'home', danger: 'warn',
      desc: '修改自己岛屿的地图类型；不带参数则在游戏内列出全部可选值' }),
  C({ cmd: '/blockingmask', syntax: '/blockingmask <island|warship> <掩码>', group: 'home',
      danger: 'warn',
      desc: '螃蟹 / 母舰基地分区开关，17 位掩码，0 全开、131071 全关' }),
  C({ cmd: '/place', syntax: '/place <X> <Y> <全局ID> [<等级>]', group: 'home', danger: 'warn',
      desc: '放置建筑 / 陷阱 / 障碍物。历史上出现过引起闪退并污染存档的情况，谨慎使用' }),
  C({ cmd: '/getstatue', syntax: '/getstatue <神像> <加成类型> <百分比>', aliases: ['/statue'],
      group: 'home', needsHome: true,
      paramOptions: { 神像: ARTIFACT_OPTIONS, 加成类型: ARTIFACT_BONUS_OPTIONS },
      desc: '给予神像。百分比超过 1000 服务端会额外提示「过强」；取值取自 CSV，见下拉' }),
  C({ cmd: '/gbe', syntax: '/gbe', group: 'home',
      desc: '快速拿到最强战舰能量雕像' }),
  C({ cmd: '/mutate', syntax: '/mutate <变异JSON>', group: 'home', danger: 'warn',
      desc: '变异自己的主基地，可传数组按顺序执行' }),
  C({ cmd: '/revivecrab', syntax: '/revivecrab', group: 'home',
      desc: '重置超级螃蟹当前阶段的破坏进度' }),
  C({ cmd: '/deco fill', syntax: '/deco fill', group: 'home', desc: '给予全部装饰物' }),
  C({ cmd: '/deco coc', syntax: '/deco coc', group: 'home', desc: '给予部落冲突联动装饰物' }),
  C({ cmd: '/deco clear', syntax: '/deco clear', group: 'home', danger: 'warn', desc: '清空装饰物' }),
  C({ cmd: '/skin fill', syntax: '/skin fill', group: 'home', desc: '给予全部皮肤' }),
  C({ cmd: '/skin clear', syntax: '/skin clear', group: 'home', danger: 'warn', desc: '清空皮肤' }),
  C({ cmd: '/officer fill', syntax: '/officer fill', group: 'home', desc: '给予全部小队长' }),
  C({ cmd: '/officer clear', syntax: '/officer clear', group: 'home', danger: 'warn', desc: '清空小队长' }),
  C({ cmd: '/prototroop fill', syntax: '/prototroop fill', group: 'home', desc: '给予全部原型部队' }),
  C({ cmd: '/prototroop clear', syntax: '/prototroop clear', group: 'home', danger: 'warn', desc: '清空原型部队' }),
  C({ cmd: '/material fill', syntax: '/material fill', aliases: ['/gadget'], group: 'home',
      desc: '给予全部建筑装置' }),
  C({ cmd: '/material list', syntax: '/material list', group: 'home', queryOnly: true,
      desc: '列出建筑装置' }),
  C({ cmd: '/material add', syntax: '/material add <matData> <statData>', group: 'home',
      desc: '添加指定建筑装置' }),
  C({ cmd: '/material clear', syntax: '/material clear', group: 'home', danger: 'warn',
      desc: '清空建筑装置' }),
  C({ cmd: '/engraving level', syntax: '/engraving level <雕刻> <值>', group: 'home',
      desc: '设置雕刻等级' }),
  C({ cmd: '/engraving quality', syntax: '/engraving quality <雕刻> <值>', group: 'home',
      desc: '设置雕刻品质' }),
  C({ cmd: '/engraving select', syntax: '/engraving select <雕刻>', group: 'home',
      desc: '选中指定雕刻' }),
  C({ cmd: '/engraving fill', syntax: '/engraving fill', group: 'home',
      desc: '全部雕刻升至满级满品质' }),
  C({ cmd: '/engraving clear', syntax: '/engraving clear', group: 'home', danger: 'destructive',
      desc: '降级全部雕刻并清空品质' }),
  C({ cmd: '/training clear', syntax: '/training clear', group: 'home', danger: 'warn',
      desc: '重置训练场记录' }),

  /* ── 地图 / 特遣队 / 母舰 ── */
  C({ cmd: '/map clear', syntax: '/map clear', group: 'map', danger: 'destructive',
      desc: '重置地图探索进度' }),
  C({ cmd: '/map fill', syntax: '/map fill', group: 'map', desc: '填充地图' }),
  C({ cmd: '/map npc', syntax: '/map npc <格号>', group: 'map', desc: '在指定格子放置 NPC' }),
  C({ cmd: '/map player', syntax: '/map player <格号> <player>', group: 'map',
      desc: '在指定格子放置玩家岛屿' }),
  C({ cmd: '/map free', syntax: '/map free <格号>', group: 'map', danger: 'warn',
      desc: '解放指定格子的岛屿。别用于 boss 基地、自己的基地、超级螃蟹' }),
  C({ cmd: '/map info', syntax: '/map info <格号>', group: 'map', queryOnly: true,
      desc: '查看格子信息' }),
  C({ cmd: '/map deepsea', syntax: '/map deepsea <格号>', group: 'map', desc: '潜水点调试' }),
  C({ cmd: '/map deepsea fill', syntax: '/map deepsea fill', group: 'map', desc: '加满潜水点' }),
  C({ cmd: '/coop intel', syntax: '/coop intel <数量>', group: 'map', desc: '设置情报数量' }),
  C({ cmd: '/coop list', syntax: '/coop list', group: 'map', queryOnly: true,
      desc: '列出当前特遣队任务序号' }),
  C({ cmd: '/coop clear', syntax: '/coop clear', group: 'map', danger: 'warn',
      desc: '结束当前特遣队任务' }),
  C({ cmd: '/coop revive', syntax: '/coop revive <序号>', group: 'map', desc: '复活任务基地' }),
  C({ cmd: '/coop bb', syntax: '/coop bb <序号> <名字>', group: 'map',
      desc: '把指定任务改为基地编辑器里的地图' }),
  C({ cmd: '/coop rename', syntax: '/coop rename <序号> <名字>', group: 'map',
      desc: '重命名任务基地' }),
  C({ cmd: '/coop xp', syntax: '/coop xp <序号> <等级>', group: 'map', desc: '设置任务基地等级' }),
  C({ cmd: '/coop mutate', syntax: '/coop mutate <序号> <变异>', group: 'map',
      desc: '变异任务基地' }),
  C({ cmd: '/warship item fill', syntax: '/warship item fill', group: 'map',
      desc: '补满战斗母舰物品' }),
  C({ cmd: '/warship item clear', syntax: '/warship item clear', group: 'map',
      desc: '清空战斗母舰物品' }),
  C({ cmd: '/warship tech clear', syntax: '/warship tech clear', group: 'map',
      danger: 'destructive', desc: '重置战斗母舰科技树' }),
  C({ cmd: '/warship max_score', syntax: '/warship max_score', group: 'map', queryOnly: true,
      desc: '查询战斗母舰最高分' }),
  C({ cmd: '/sector list', syntax: '/sector list', aliases: ['/tribe'], group: 'map',
      queryOnly: true, desc: '列出部族加成' }),
  C({ cmd: '/sector reset_supplies', syntax: '/sector reset_supplies', group: 'map',
      desc: '清空原始水晶兑换记录' }),
  C({ cmd: '/rule list', syntax: '/rule list', group: 'map', queryOnly: true,
      desc: '列出当前自定义规则' }),
  C({ cmd: '/rule spell', syntax: '/rule spell [<spell>]', group: 'map',
      desc: '打 NPC 时附加额外战舰能力。只能生效一个，填多个取最后一个' }),
  C({ cmd: '/rule bonus', syntax: '/rule bonus <加成> <千分比> [<过滤器>]', group: 'map',
      desc: '打 NPC 时附加部族加成。同类只有第一个生效，单位为千分之一，可为负' }),
  C({ cmd: '/rule remove', syntax: '/rule remove <序号>', group: 'map', desc: '移除一条规则' }),
  C({ cmd: '/rule clear', syntax: '/rule clear', group: 'map', desc: '清空全部规则' }),
  C({ cmd: '/supplychest reset', syntax: '/supplychest reset', group: 'map',
      desc: '重置补给箱' }),
  C({ cmd: '/trader reset', syntax: '/trader reset', group: 'map',
      desc: '重置商人。商人不同步时可以试试' }),

  /* ── 调试 ── */
  C({ cmd: '/stats', syntax: '/stats [<player>]', group: 'debug', queryOnly: true,
      desc: '查看玩家统计数据' }),
  C({ cmd: '/getplayer', syntax: '/getplayer <player>', group: 'debug', queryOnly: true,
      desc: '查询玩家' }),
  C({ cmd: '/datatable', syntax: '/datatable <类型ID>', group: 'debug', queryOnly: true,
      desc: '查看数据表' }),
  C({ cmd: '/tag2id', syntax: '/tag2id <#标签>', group: 'debug', queryOnly: true,
      desc: '玩家标签转 ID，标签需以 # 开头' }),
  C({ cmd: '/id2tag', syntax: '/id2tag <ID>', group: 'debug', queryOnly: true,
      desc: '玩家 ID 转标签' }),
  C({ cmd: '/time', syntax: '/time', group: 'debug', queryOnly: true, desc: '查看服务器时间' }),
  C({ cmd: '/maxid', syntax: '/maxid', group: 'debug', queryOnly: true, desc: '查看最大玩家 ID' }),
  C({ cmd: '/recalcexp', syntax: '/recalcexp', group: 'debug', desc: '重算经验' }),
  C({ cmd: '/calctime', syntax: '/calctime', group: 'debug', queryOnly: true, desc: '计时统计' }),
  C({ cmd: '/defvalue', syntax: '/defvalue', group: 'debug', queryOnly: true, desc: '查看防御数值' }),
  C({ cmd: '/debugmap', syntax: '/debugmap', group: 'debug', queryOnly: true, desc: '地图调试信息' }),
  C({ cmd: '/testbase', syntax: '/testbase', group: 'debug', desc: '测试基地' }),
  C({ cmd: '/testbase2', syntax: '/testbase2', group: 'debug', desc: '测试基地 2' }),
  C({ cmd: '/loadtest', syntax: '/loadtest', group: 'debug', desc: '加载测试' }),
  C({ cmd: '/debugrb', syntax: '/debugrb [server]', group: 'debug', queryOnly: true,
      desc: '回放调试信息' }),
  C({ cmd: '/gomgr', syntax: '/gomgr', group: 'debug', queryOnly: true, desc: '游戏对象管理器信息' }),
  C({ cmd: '/goinfo', syntax: '/goinfo <对象ID>', group: 'debug', queryOnly: true,
      desc: '查看游戏对象信息' }),
  C({ cmd: '/gotest', syntax: '/gotest <谓词JSON>', group: 'debug', advancedOnly: true,
      desc: '按谓词 JSON 查询游戏对象' }),
  C({ cmd: '/value', syntax: '/value <JSON>', group: 'debug', advancedOnly: true,
      desc: '求值 JSON 表达式' }),
  C({ cmd: '/string', syntax: '/string <JSON>', group: 'debug', advancedOnly: true,
      desc: '求值为字符串' }),
  C({ cmd: '/outsy', syntax: '/outsy', group: 'debug', danger: 'warn', advancedOnly: true,
      desc: '强制服务端与客户端不同步。会把你的客户端搞坏，仅调试用' }),
  C({ cmd: '/serr', syntax: '/serr', group: 'debug', danger: 'warn', advancedOnly: true,
      desc: '强制让客户端收到服务端错误。会把你的客户端搞坏，仅调试用' }),
  C({ cmd: '/disconnect', syntax: '/disconnect', group: 'debug', danger: 'warn',
      advancedOnly: true, desc: '断开自己的连接' }),
  C({ cmd: '/servermsg', syntax: '/servermsg', group: 'debug', danger: 'warn',
      advancedOnly: true, desc: '触发服务端消息，会打断客户端' }),

  /* ── 管理员 ── */
  C({ cmd: '/op', syntax: '/op <player>', group: 'admin', admin: true, desc: '授予管理员权限' }),
  C({ cmd: '/deop', syntax: '/deop <player>', group: 'admin', admin: true, desc: '撤销管理员权限' }),
  C({ cmd: '/kick', syntax: '/kick <player>', group: 'admin', admin: true, desc: '踢下线' }),
  C({ cmd: '/ban', syntax: '/ban <player> [<理由>] [<秒数>]', group: 'admin', admin: true,
      danger: 'warn', desc: '封禁玩家' }),
  C({ cmd: '/pardon', syntax: '/pardon <player>', aliases: ['/unban'], group: 'admin',
      admin: true, desc: '解封玩家' }),
  C({ cmd: '/banip', syntax: '/banip [<IP>]', group: 'admin', admin: true, danger: 'warn',
      desc: '封禁 IP' }),
  C({ cmd: '/pardonip', syntax: '/pardonip <IP>', group: 'admin', admin: true, desc: '解封 IP' }),
  C({ cmd: '/playerinfo', syntax: '/playerinfo [<player>]', aliases: ['/pi'], group: 'admin',
      admin: true, queryOnly: true, desc: '查看玩家详细信息' }),
  C({ cmd: '/acccache', syntax: '/acccache [save|<player>]', group: 'admin', admin: true,
      desc: '账号缓存：查看或落盘' }),
  C({ cmd: '/pp', syntax: '/pp <player> <修改JSON>', group: 'admin', admin: true,
      danger: 'warn', advancedOnly: true, desc: '直接修改玩家存档' }),
  C({ cmd: '/adminmutate', syntax: '/adminmutate <player> <变异>', group: 'admin', admin: true,
      danger: 'warn', desc: '变异指定玩家的基地' }),
  C({ cmd: '/clearstream', syntax: '/clearstream', group: 'admin', admin: true, danger: 'warn',
      desc: '清空全服聊天' }),
  C({ cmd: '/role', syntax: '/role <1-4>', group: 'admin', admin: true, desc: '设置聊天身份' }),
  C({ cmd: '/reload', syntax: '/reload', group: 'admin', admin: true,
      desc: '重载 JSON 配置与 NPC 基地' }),
  C({ cmd: '/badword', syntax: '/badword <get|search|searchall|test> <参数>', group: 'admin',
      admin: true, queryOnly: true, desc: '敏感词表查询与测试' }),
  C({ cmd: '/bd2chr', syntax: '/bd2chr <data>', group: 'admin', admin: true, advancedOnly: true,
      desc: '建筑数据转角色数据' }),
  C({ cmd: '/tocsv', syntax: '/tocsv <data>', group: 'admin', admin: true, advancedOnly: true,
      desc: '导出为 CSV' }),
  C({ cmd: '/cocbd', syntax: '/cocbd <all|data>', group: 'admin', admin: true, advancedOnly: true,
      desc: '部落冲突建筑数据' }),
  C({ cmd: '/allbd', syntax: '/allbd <数量>', group: 'admin', admin: true, advancedOnly: true,
      desc: '批量建筑数据' }),
  C({ cmd: '/vp', syntax: '/vp <island|warship> <数值>', aliases: ['/trophy'], group: 'admin',
      admin: true, desc: '设置奖杯数。写在家园代码里，但需要管理员权限' }),
  C({ cmd: '/crab', syntax: '/crab <阶段>', group: 'admin', admin: true,
      desc: '设置超级螃蟹阶段。需要管理员权限' }),
  C({ cmd: '/log copy', syntax: '/log copy <player>', group: 'admin', admin: true,
      desc: '复制指定玩家的日志' }),
  C({ cmd: '/maintenance', syntax: '/maintenance', group: 'admin', admin: true,
      desc: '维护模式占位，当前只会回一句 Maintenance is WIP....' })
]

/* ── 派生工具 ── */

export const COMMANDS_BY_GROUP = COMMAND_GROUP_META.map((meta) => ({
  meta,
  items: COMMAND_CATALOG.filter((c) => c.group === meta.id)
}))

/** 搜索：指令名 / 别名 / 说明 模糊匹配 */
export function searchCatalog(query: string): CatalogCommand[] {
  const q = query.trim().toLowerCase()
  if (!q) return COMMAND_CATALOG
  return COMMAND_CATALOG.filter(
    (c) =>
      c.cmd.toLowerCase().includes(q) ||
      c.syntax.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.aliases.some((a) => a.toLowerCase().includes(q))
  )
}

/**
 * 按完整指令反查目录条目，取最长前缀匹配。
 * 用于让快捷按钮、生成器等入口继承同一份危险级别与标记，
 * 避免「目录里要二次确认、快捷按钮点一下就执行」这种不一致。
 *
 *   /resource clear      → 命中 /resource clear（不可撤销）
 *   /resource 1 9999999  → 命中 /resource（无危险标记）
 */
export function findCatalogEntry(command: string): CatalogCommand | null {
  const norm = '/' + command.trim().replace(/^\/+/, '').toLowerCase()
  let best: CatalogCommand | null = null
  for (const c of COMMAND_CATALOG) {
    const key = c.cmd.toLowerCase()
    if (norm === key || norm.startsWith(key + ' ')) {
      if (!best || key.length > best.cmd.length) best = c
    }
  }
  return best
}
