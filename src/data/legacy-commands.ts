/**
 * 合成不出来、只能原样保留的条目。
 *
 * 由 scripts/seed-legacy-commands.mjs 从已删除的 commands.json 抢救而来。
 * 「指令形态 × 实体表」产不出它们，COMMAND_CATALOG 里也没有对应写法。
 *
 * copyOnly 为真的那些是服务端 dispatcher 根本没注册的：早期死指令
 * （/editor、/getdata、/newge）和裸父节点（/log、/coop —— 不带子指令
 * 发过去会报解析错）。点「执行」必然失败，所以只给复制。
 * 其余是真指令的取值预设（/rule bonus 1 100、/log activity deepsea），照常可执行。
 */
export interface LegacyCommand {
  command: string
  name: string
  category: string
  /** 服务端没注册，点了必然失败，所以只给复制 */
  copyOnly?: boolean
}

export const LEGACY_COMMANDS: LegacyCommand[] = [
  {
    command: '/rename <名字>',
    name: '更改名字',
    category: 'common'
  },
  {
    command: '点击游戏初始主基地岛屿界面左侧蓝色按钮里的解锁科技',
    name: '研究所科技所有东西满级',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/visitplayer <id>',
    name: '侦查玩家',
    category: 'common'
  },
  {
    command: '/atkpr <id>',
    name: '随机攻击玩家',
    category: 'common'
  },
  {
    command: '/attackwarship <玩家ID>或<玩家标签>',
    name: '进攻玩家战斗母舰基地（留空则攻击自己，/attackw /atkw 等同于 /attackwarship）',
    category: 'common'
  },
  {
    command: '/visitwarship <玩家ID>或<玩家标签>',
    name: '访问玩家战斗母舰基地（留空则攻击自己，/visitw 等同于 /visitwarship）',
    category: 'common'
  },
  {
    command: '/tag2id <tag>',
    name: '玩家标签转换为玩家ID，注意要以 # 开头',
    category: 'common'
  },
  {
    command: '/id2tag <id>',
    name: '玩家ID转换为玩家标签',
    category: 'common'
  },
  {
    command: '/basebuilder2 <基地名>',
    name: '侦查基地编辑器制作的地图',
    category: 'common'
  },
  {
    command: '/attackbuilding <建筑ID>',
    name: '生成铺满同种建筑的特遣队任务基地（/atkbd 等同于 /attackbuilding）',
    category: 'common'
  },
  {
    command: '/map npc <tile_index>',
    name: '在地图指定位置添加随机NPC',
    category: 'common'
  },
  {
    command: '/map free <tile_index>',
    name: '解放指定位置的岛屿。注意：请不要用于boss基地、自己的基地、超级螃蟹等，仅适用于普通NPC和玩家岛。',
    category: 'common'
  },
  {
    command: '/visitlevel <layout> <文件路径>',
    name: '访问指定JSON文件基地（示例：/visitlevel playerbase Gamefiles/playerbase.json，/scoutlevel 等同于 /visitlevel）',
    category: 'common'
  },
  {
    command: '/attacklevel <layout> <文件路径>',
    name: '进攻指定JSON文件基地（示例：/atklvl playerbase Gamefiles/playerbase.json，/atklvl 等同于 /attacklevel）',
    category: 'common'
  },
  {
    command: '/newge [<难度>]',
    name: '用新基地生成器生成随机基地（用于进攻）',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/newge2 [<难度>]',
    name: '用新基地生成器生成随机基地（用于侦察）',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/editor <不含后缀的文件名>',
    name: '读取xlsx文件基地（用于进攻，示例：/editor small_b 读取Config/xlsx/small_b.xlsx）',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/editor2 <不含后缀的文件名>',
    name: '读取xlsx文件基地（用于侦察）',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/log notice clear',
    name: '清空邮箱日志',
    category: 'common'
  },
  {
    command: '/replay last',
    name: '播放自己的上一个回放',
    category: 'common'
  },
  {
    command: '/replay <回放ID>',
    name: '输入战斗回放ID进行播放',
    category: 'common'
  },
  {
    command: '/replay random',
    name: '随机播放回放',
    category: 'common'
  },
  {
    command: '/replay count',
    name: '获取全服回放数量',
    category: 'common'
  },
  {
    command: '/replay [<回放ID>|count|last|random]',
    name: '播放指定回放（未指定则播放Config/replay.json）',
    category: 'common'
  },
  {
    command: '/experience <等级> <剩余经验>',
    name: '设置经验等级和剩余经验值',
    category: 'common'
  },
  {
    command: '/getstatue 40 7 1000100',
    name: '负数的神像效果！(不直接支持，但是1000000%一百万 ~ 1000100%一百万零一百 ==> -0% ~ -100%)这里只是举例子',
    category: 'common'
  },
  {
    command: '/troopcount 数量',
    name: '更改登陆艇部队数量（最大100）',
    category: 'common'
  },
  {
    command: '/getplayer <players>',
    name: '获取玩家账号（最多20条）',
    category: 'common'
  },
  {
    command: '/getdata <data>',
    name: '获取一条csv记录',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/datatable <type_id>',
    name: '获取一个csv表的全部ID和名称清单',
    category: 'common'
  },
  {
    command: '/provider',
    name: '数值提供器（等同于/value）',
    category: 'common',
    copyOnly: true
  },
  {
    command: '/getstatue 46 8 999',
    name: '能量雕像999%',
    category: '雕像'
  },
  {
    command: '/getstatue 43 6 999',
    name: '红攻雕像999%',
    category: '雕像'
  },
  {
    command: '/getstatue 43 4 999',
    name: '红防雕像999%',
    category: '雕像'
  },
  {
    command: '/getstatue 40 7 999',
    name: '蓝攻雕像999%',
    category: '雕像'
  },
  {
    command: '/getstatue 40 7 136348',
    name: '最强蓝攻雕像136348%',
    category: '雕像'
  },
  {
    command: '/getstatue 40 5 999',
    name: '蓝防雕像999%',
    category: '雕像'
  },
  {
    command: '/getstatue 40 5 7058',
    name: '最强蓝防雕像7058%',
    category: '雕像'
  },
  {
    command: '/rule bonus 1 100',
    name: '为战局内增加蓝防10%',
    category: '雕像'
  },
  {
    command: '/rule bonus 2 100',
    name: '为战局内增加红攻10%',
    category: '雕像'
  },
  {
    command: '/rule bonus 3 100',
    name: '为战局内增加蓝攻10%',
    category: '雕像'
  },
  {
    command: '/rule bonus 0 100',
    name: '为战局内增加红防10%',
    category: '雕像'
  },
  {
    command: '/rule bonus 1',
    name: '移除战局内额外增添的蓝防数值',
    category: '雕像'
  },
  {
    command: '/rule bonus 2',
    name: '移除战局内额外增添的红攻数值',
    category: '雕像'
  },
  {
    command: '/rule bonus 3',
    name: '移除战局内额外增添的蓝攻数值',
    category: '雕像'
  },
  {
    command: '/rule bonus 0',
    name: '移除战局内额外增添的红防数值',
    category: '雕像'
  },
  {
    command: '/engraving select <雕刻ID>',
    name: '强行启用雕刻，不受数量限制（即使没解锁也可以直接启用）',
    category: '雕刻'
  },
  {
    command: '/attack',
    name: '攻击',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/engraving',
    name: '雕刻',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/event',
    name: '事件',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/getbd',
    name: '获取BD',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/gomg',
    name: '说明待补充',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/log',
    name: '日志',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/log activity deepsea',
    name: '深海活动日志',
    category: '全部'
  },
  {
    command: '/log activity enemy',
    name: '敌方活动日志',
    category: '全部'
  },
  {
    command: '/log activity event',
    name: '事件活动日志',
    category: '全部'
  },
  {
    command: '/log activity invade',
    name: '入侵活动日志',
    category: '全部'
  },
  {
    command: '/log activity summary',
    name: '活动总结日志',
    category: '全部'
  },
  {
    command: '/log notice chest',
    name: '宝箱通知日志',
    category: '全部'
  },
  {
    command: '/log notice custom',
    name: '自定义通知日志',
    category: '全部'
  },
  {
    command: '/log warship',
    name: '战舰日志',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/map',
    name: '地图',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/newge',
    name: '基地生成器',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/newge2',
    name: '基地生成器',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/officer',
    name: '军官',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/prototroop',
    name: '原型部队',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/scout',
    name: '侦察（简写，对应visitplayer）',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/serverinfo',
    name: '服务器信息',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/skin',
    name: '皮肤',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/visit',
    name: '访问（玩家）（简写，对应visitplayer）',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/visittw',
    name: '访问战舰（简写，对应visitwarship）',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/warship',
    name: '战舰',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/warship item',
    name: '战舰物品',
    category: '全部',
    copyOnly: true
  },
  {
    command: '/coop',
    name: '请选择特遣队命令',
    category: '特遣队',
    copyOnly: true
  },
  {
    command: '/coop intel 数值',
    name: '将情报改为指定的数值',
    category: '特遣队'
  },
  {
    command: '/coop bb 序号 地图名',
    name: '将指定的特遣队任务改为地图编辑器里的地图',
    category: '特遣队'
  },
  {
    command: '/coop revive 序号',
    name: '复活指定的地图',
    category: '特遣队'
  }
]
