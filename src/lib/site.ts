/**
 * 站点级常量 —— 被 sitemap / robots / OG / RSS 等共用
 */

export const SITE_URL = 'https://30hb.cn'

/* metadataBase 需要 URL 实例；SITE_URL 是写死的合法地址，解析失败时退回占位，
 * 而不是让整个 layout 在模块加载期抛 TypeError。 */
export const SITE_METADATA_BASE = (() => {
  try {
    return new URL(SITE_URL)
  } catch {
    return new URL('https://30hb.cn')
  }
})()

export const SITE_NAME = '蚕豆私服'
export const SITE_NAME_EN = 'Horsebean Private Server - Boom Beach Private Server'
export const SITE_DESCRIPTION = '非官方的海岛奇兵私服，体验无限资源和独特玩法'
export const SITE_DESCRIPTION_EN =
  'Unofficial Boom Beach private server — unlimited resources, unique gameplay, forever free.'
export const SITE_LOCALE = 'zh_CN'
export const SITE_LOCALE_ALT = 'en_US'
export const SITE_LOGO = '/og-logo.png'
