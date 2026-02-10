/**
 * 游戏素材：使用本地文件（运行 pnpm run download-assets 拉取到 public）
 * 源: Boom Beach Fandom 维基 → 下载到 public/assets/images/game/
 */
const GAME = '/assets/images/game'

/** CTA、角色区等使用的图（本地） */
export const ASSETS = {
  /** 船长 / 指挥官（群岛战略图） */
  commander: `${GAME}/commander.avif`,
  /** 哈莫曼（Boss 基地 1） */
  hammerman: `${GAME}/hammerman.avif`,
  /** 单图占位 */
  island: `${GAME}/island.avif`,
  /** 地图展示 13 张 */
  mapSlots: Array.from({ length: 13 }, (_, i) => `${GAME}/map-${i + 1}.avif`),
  /** 创意轮播 4 张 */
  creativeSlides: Array.from({ length: 4 }, (_, i) => `${GAME}/creative-${i + 1}.avif`)
}
