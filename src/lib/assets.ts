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
  /** 创意配图 */
  creative: `${GAME}/creative-1.avif`
}
