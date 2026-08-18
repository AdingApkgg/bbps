/**
 * 指令面板的一键常用指令。
 *
 * 危险级别不在这里重复声明 —— 由 findCatalogEntry() 从 lib/commands.ts
 * 反查，保证与目录一致（/resource clear 在目录里要二次确认，
 * 这里点了同样要）。
 *
 * command 一律不带开头的 `/`（接口要求），展示时再补上。
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
      { command: 'log attack clear', labelZh: '进攻日志闪退', labelEn: 'Attack log crash' },
      { command: 'log activity clear', labelZh: '活动日志闪退', labelEn: 'Activity log crash' },
      { command: 'map deepsea reset', labelZh: '潜水艇闪退', labelEn: 'Submarine crash' },
      { command: 'trader reset', labelZh: '商人不同步', labelEn: 'Trader out of sync' },
      { command: 'supplychest reset', labelZh: '补给箱异常', labelEn: 'Supply chest stuck' }
    ]
  },
  {
    id: 'account',
    labelZh: '账号信息',
    labelEn: 'Account',
    noteZh: '结果只在游戏内显示',
    noteEn: 'Results appear in game only',
    items: [
      { command: 'me', labelZh: '我的账号信息', labelEn: 'My account' },
      { command: 'test', labelZh: '测试连接', labelEn: 'Test connection' },
      { command: 'olp', labelZh: '在线玩家', labelEn: 'Players online' },
      { command: 'help', labelZh: '指令帮助', labelEn: 'Command help' },
      { command: 'visitplayer', labelZh: '侦查自己的基地', labelEn: 'Scout my base' }
    ]
  },
  {
    id: 'resource',
    labelZh: '资源',
    labelEn: 'Resources',
    items: [
      { command: 'resource fill', labelZh: '一键补满常用资源', labelEn: 'Fill common resources' },
      { command: 'resource 1 9999999', labelZh: '999 万黄金', labelEn: '9.99M gold' },
      { command: 'resource 2 9999999', labelZh: '999 万木材', labelEn: '9.99M wood' },
      { command: 'resource 3 9999999', labelZh: '999 万石材', labelEn: '9.99M stone' },
      { command: 'resource 4 9999999', labelZh: '999 万钢材', labelEn: '9.99M iron' },
      { command: 'resource clear', labelZh: '清空资源', labelEn: 'Clear resources' }
    ]
  },
  {
    id: 'base',
    labelZh: '基地',
    labelEn: 'Base',
    items: [
      { command: 'easy', labelZh: '一键满级基地', labelEn: 'Max out base' },
      { command: 'upgrade', labelZh: '建筑全升满', labelEn: 'Upgrade all buildings' },
      { command: 'engraving fill', labelZh: '雕刻满级满品质', labelEn: 'Max all engravings' },
      { command: 'deco fill', labelZh: '解锁全部装饰', labelEn: 'Unlock all decorations' },
      { command: 'skin fill', labelZh: '解锁全部皮肤', labelEn: 'Unlock all skins' },
      { command: 'officer fill', labelZh: '解锁全部小队长', labelEn: 'Unlock all officers' },
      { command: 'unboost', labelZh: '清除神像加成', labelEn: 'Expire statue boosts' },
      { command: 'clearobstacles', labelZh: '移除所有障碍物', labelEn: 'Clear obstacles' }
    ]
  },
  {
    id: 'battle',
    labelZh: '战斗',
    labelEn: 'Battle',
    items: [
      { command: 'atkpr', labelZh: '随机打一个玩家', labelEn: 'Attack a random player' },
      { command: 'attackplayer', labelZh: '打自己的基地', labelEn: 'Attack my own base' },
      { command: 'defend', labelZh: '防守演练', labelEn: 'Defense drill' },
      { command: 'revivecrab', labelZh: '重置螃蟹进度', labelEn: 'Reset crab progress' },
      { command: 'warship item fill', labelZh: '补满母舰物品', labelEn: 'Fill warship items' }
    ]
  },
  {
    id: 'alliance',
    labelZh: '特遣队',
    labelEn: 'Task Force',
    items: [
      { command: 'coop list', labelZh: '列出任务序号', labelEn: 'List ops' },
      { command: 'coop clear', labelZh: '关闭当前任务', labelEn: 'Close current ops' },
      { command: 'sector list', labelZh: '查看部族加成', labelEn: 'List tribe bonuses' }
    ]
  }
]
