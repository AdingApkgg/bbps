/**
 * 指令面板的一键常用指令。
 *
 * 只收录**无参数**且用途明确的指令 —— 需要填参数的走高级模式自由输入框。
 * command 一律不带开头的 `/`（接口要求），展示时再补上。
 * 每条都对应 src/data/commands.json 中真实存在的指令。
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
  items: QuickCommand[]
}

export const QUICK_COMMANDS: QuickCommandGroup[] = [
  {
    id: 'account',
    labelZh: '账号信息',
    labelEn: 'Account',
    items: [
      { command: 'help', labelZh: '查看指令帮助', labelEn: 'Command help' },
      { command: 'visitplayer', labelZh: '侦查自己的基地', labelEn: 'Scout your own base' },
      { command: 'UTC', labelZh: '查看服务器时间', labelEn: 'Server time (UTC)' },
      { command: 'Bebean', labelZh: '本服机器人介绍', labelEn: 'About the server bot' }
    ]
  },
  {
    id: 'resource',
    labelZh: '资源',
    labelEn: 'Resources',
    items: [
      { command: 'resource 1 9999999', labelZh: '获取 999 万金币', labelEn: 'Get 9.99M coins' },
      { command: 'resource 2 9999999', labelZh: '获取 999 万木材', labelEn: 'Get 9.99M wood' },
      { command: 'resource 3 9999999', labelZh: '获取 999 万钢材', labelEn: 'Get 9.99M steel' },
      { command: 'resource 4 9999999', labelZh: '获取 999 万石材', labelEn: 'Get 9.99M stone' },
      { command: 'resource 0 9999999', labelZh: '获取 999 万钻石', labelEn: 'Get 9.99M diamonds' },
      { command: 'resource clear', labelZh: '清空全部资源', labelEn: 'Clear all resources' }
    ]
  },
  {
    id: 'base',
    labelZh: '基地',
    labelEn: 'Base',
    items: [
      { command: 'easy', labelZh: '一键满级基地', labelEn: 'Max out base' },
      { command: 'upgrade', labelZh: '所有建筑升至满级', labelEn: 'Upgrade all buildings' },
      { command: 'layout playerbase', labelZh: '恢复默认岛屿布局', labelEn: 'Reset to default layout' },
      { command: 'engraving fill', labelZh: '雕刻全部满级满品质', labelEn: 'Max all engravings' },
      { command: 'map clear', labelZh: '重置地图云层', labelEn: 'Reset map fog' },
      { command: 'map fill', labelZh: '地图全部覆盖云层', labelEn: 'Fill map with fog' }
    ]
  },
  {
    id: 'alliance',
    labelZh: '特遣队',
    labelEn: 'Task Force',
    items: [
      { command: 'coop list', labelZh: '列出特遣队任务序号', labelEn: 'List task force ops' },
      { command: 'coop clear', labelZh: '关闭已开启的任务', labelEn: 'Close active ops' },
      { command: 'warship item fill', labelZh: '补满战斗母舰物品', labelEn: 'Fill warship items' }
    ]
  }
]
