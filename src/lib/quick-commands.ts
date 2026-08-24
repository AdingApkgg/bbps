/**
 * 一键常用指令。
 *
 * 分组顺序与选条依据生产服务器的真实使用量
 * （GET /api/global_statistics 的 hbcmd_run_*，2026-08 快照，
 *  总执行 54.6 万次）。跑 scripts/rank-by-usage.mjs 可复查当前分布。
 *
 * 实测分布极度集中：/resource 一条占 53.5%，Top 12 覆盖 90%。
 * 所以这里只放高频项 —— 之前手挑的 /sector list（7 次）、
 * /revivecrab（37 次）这类已移出，仍可在下方指令目录里找到。
 *
 * 例外：闪退自救不按使用量排。它是应急入口，用得少才是正常的。
 *
 * 危险级别不在这里声明，由 findCatalogEntry() 从 lib/commands.ts 反查。
 * command 一律不带开头的 `/`。
 */

export interface QuickCommand {
  command: string
  labelZh: string
  labelEn: string
}

export interface QuickCommandGroup {
  id: string
  labelZh: string
  labelEn: string
  noteZh?: string
  noteEn?: string
  items: QuickCommand[]
}

export const QUICK_COMMANDS: QuickCommandGroup[] = [
  {
    id: 'rescue',
    labelZh: '闪退自救',
    labelEn: 'Crash rescue',
    noteZh: '点开某个界面就闪退时，先试这几条',
    noteEn: 'Try these first when opening a screen crashes the game',
    items: [
      { command: 'map deepsea reset', labelZh: '潜水艇闪退', labelEn: 'Submarine crash' },
      { command: 'log attack clear', labelZh: '进攻日志闪退', labelEn: 'Attack log crash' },
      { command: 'log activity clear', labelZh: '活动日志闪退', labelEn: 'Activity log crash' },
      { command: 'trader reset', labelZh: '商人不同步', labelEn: 'Trader out of sync' },
      { command: 'supplychest reset', labelZh: '补给箱异常', labelEn: 'Supply chest stuck' }
    ]
  },
  {
    id: 'resource',
    labelZh: '资源',
    labelEn: 'Resources',
    noteZh: '全服用得最多的一类，占全部指令执行的一半以上',
    noteEn: 'By far the most-used commands — over half of all executions',
    items: [
      { command: 'resource fill', labelZh: '一键补满常用资源', labelEn: 'Fill common resources' },
      { command: 'resource 1 9999999', labelZh: '999 万黄金', labelEn: '9.99M gold' },
      { command: 'resource 2 9999999', labelZh: '999 万木材', labelEn: '9.99M wood' },
      { command: 'resource 3 9999999', labelZh: '999 万石材', labelEn: '9.99M stone' },
      { command: 'resource 4 9999999', labelZh: '999 万钢材', labelEn: '9.99M iron' },
      { command: 'resource 0 9999999', labelZh: '999 万钻石', labelEn: '9.99M diamonds' },
      { command: 'resource clear', labelZh: '清空资源', labelEn: 'Clear resources' }
    ]
  },
  {
    id: 'statue',
    labelZh: '神像',
    labelEn: 'Statues',
    noteZh: '使用量第二，以下为常见组合；要自定义见下方指令目录',
    noteEn: 'Second most-used. Common presets below; use the catalog to customise.',
    items: [
      { command: 'getstatue 46 8 999', labelZh: '战舰能量 999%', labelEn: 'Gunboat energy 999%' },
      { command: 'getstatue 43 6 999', labelZh: '部队伤害 999%', labelEn: 'Troop damage 999%' },
      { command: 'getstatue 43 4 999', labelZh: '部队生命 999%', labelEn: 'Troop health 999%' },
      { command: 'getstatue 40 7 999', labelZh: '建筑伤害 999%', labelEn: 'Building damage 999%' },
      { command: 'getstatue 40 5 999', labelZh: '建筑生命 999%', labelEn: 'Building health 999%' },
      { command: 'gbe', labelZh: '最强战舰能量雕像', labelEn: 'Best gunboat energy statue' }
    ]
  },
  {
    id: 'coop',
    labelZh: '特遣队',
    labelEn: 'Task Force',
    items: [
      { command: 'coop list', labelZh: '列出任务序号', labelEn: 'List ops' },
      { command: 'coop clear', labelZh: '关闭当前任务', labelEn: 'Close current ops' }
    ]
  },
  {
    id: 'unlock',
    labelZh: '一键解锁',
    labelEn: 'Unlock all',
    items: [
      { command: 'officer fill', labelZh: '全部小队长', labelEn: 'All officers' },
      { command: 'skin fill', labelZh: '全部皮肤', labelEn: 'All skins' },
      { command: 'prototroop fill', labelZh: '全部原型部队', labelEn: 'All prototypes' },
      { command: 'engraving fill', labelZh: '雕刻满级满品质', labelEn: 'Max all engravings' },
      { command: 'deco fill', labelZh: '全部装饰', labelEn: 'All decorations' }
    ]
  },
  {
    id: 'account',
    labelZh: '账号与基地',
    labelEn: 'Account & base',
    noteZh: '查询类结果只在游戏内显示',
    noteEn: 'Query results appear in game only',
    items: [
      { command: 'me', labelZh: '我的账号信息', labelEn: 'My account' },
      { command: 'upgrade', labelZh: '建筑全升满', labelEn: 'Upgrade all buildings' },
      { command: 'clearobstacles', labelZh: '移除所有障碍物', labelEn: 'Clear obstacles' },
      { command: 'olp', labelZh: '在线玩家', labelEn: 'Players online' },
      { command: 'help', labelZh: '指令帮助', labelEn: 'Command help' }
    ]
  },
  {
    id: 'battle',
    labelZh: '战斗',
    labelEn: 'Battle',
    items: [
      { command: 'attackplayer', labelZh: '打自己的基地', labelEn: 'Attack my own base' },
      { command: 'defend', labelZh: '防守演练', labelEn: 'Defense drill' },
      { command: 'warship item fill', labelZh: '补满母舰物品', labelEn: 'Fill warship items' }
    ]
  }
]
