/**
 * 关卡布局（layout）名录。
 *
 * 从 commands.ts 里抽出来单独成文件：它是游戏的关卡参考数据，现在被两个
 * 互不相干的地方用着（指令面板的 <layout> 参数、地图页的类型列），留在
 * 指令定义文件里会让地图页反过来依赖整个指令目录。
 *
 * 注意这**不是**为了减小打包体积 —— commands.ts 目前落在站点级共享 chunk 里，
 * 每个页面都会下载它，抽不抽都一样。纯粹是依赖方向上的整理。
 */
import type { ParamOption } from '@/lib/commands'

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
