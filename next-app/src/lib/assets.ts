/**
 * 游戏素材：Boom Beach 官方风格图（来自 Fandom 维基，游戏相关展示用）
 * @see https://boombeach.fandom.com/wiki/Category:Images
 */
const WIKI =
  'https://static.wikia.nocookie.net/boombeach/images'
const WIKI_V2 = 'https://vignette2.wikia.nocookie.net/boombeach/images'
const WIKI_V3 = 'https://vignette3.wikia.nocookie.net/boombeach/images'
const WIKI_V4 = 'https://vignette4.wikia.nocookie.net/boombeach/images'
const WIKI_V1 = 'https://vignette1.wikia.nocookie.net/boombeach/images'
const rev = (path: string, cb: string) => `${path}/revision/latest?cb=${cb}`

/** 群岛地图（指挥官 / 战略视角） */
const ARCHIPELAGO_MAP = rev(
  `${WIKI}/5/50/Archipelago_Map.PNG`,
  '20150704000801'
)
/** 哈莫曼 Boss 基地截图 1–8 */
const BOSS_BASES = [
  rev(`${WIKI_V2}/e/ef/Boss_Base_1.png`, '20161125192755'),
  rev(`${WIKI_V2}/8/80/Boss_Base_2.png`, '20161125192755'),
  rev(`${WIKI_V2}/f/f7/Boss_Base_3.png`, '20161125192756'),
  rev(`${WIKI_V4}/b/b2/Boss_Base_4.png`, '20161125192757'),
  rev(`${WIKI_V3}/f/fa/Boss_Base_5.png`, '20161125192757'),
  rev(`${WIKI_V4}/f/f7/Boss_Base_6.png`, '20161125192758'),
  rev(`${WIKI_V1}/9/93/Boss_Base_7.png`, '20161125192758'),
  rev(`${WIKI_V4}/2/28/Boss_Base_8.png`, '20161125192758')
]

/** CTA、角色区等使用的图 */
export const ASSETS = {
  /** 船长 / 指挥官（群岛战略图） */
  commander: ARCHIPELAGO_MAP,
  /** 哈莫曼（Boss 基地 1） */
  hammerman: BOSS_BASES[0],
  /** 单图占位（地图/创意等） */
  island: BOSS_BASES[1],
  /** 地图展示 13 张：Boss 基地 1–8 再循环 1–5 */
  mapSlots: [
    ...BOSS_BASES,
    BOSS_BASES[0],
    BOSS_BASES[1],
    BOSS_BASES[2],
    BOSS_BASES[3],
    BOSS_BASES[4]
  ],
  /** 创意轮播 4 张：Boss 基地 1–4 */
  creativeSlides: BOSS_BASES.slice(0, 4)
}
