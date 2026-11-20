import type { Metadata } from 'next'
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_LOCALE,
  SITE_LOCALE_ALT,
  SITE_NAME,
  SITE_URL
} from './site'

interface PageMetaArgs {
  /** 站内路径，带尾斜杠，例如 'downloads/'；英文页以 'en/' 开头 */
  path: string
  /** 页面标题，不含站点名 —— 模板和 og:title 都由这里拼 */
  title: string
  description?: string
  /** 首页这类标题已经完整说明自己的，不再套 `| 站点名` */
  absolute?: boolean
}

/**
 * 页面级 metadata。
 *
 * 31 个页面原先各抄一份同构的 title/description/canonical/hreflang/openGraph，
 * 每加一页就多一处漏改的机会（尾斜杠、hreflang 顺序、og 标题漏拼站点名都踩过）。
 * 这里按 path 推语言与 canonical，页面只负责标题和描述。
 */
export function pageMetadata({ path, title, description, absolute }: PageMetaArgs): Metadata {
  const isEn = path.startsWith('en/')
  const canon = `${SITE_URL}/${path}`
  const desc = description ?? (isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION)
  const siteName = isEn ? 'Horsebean Private Server' : SITE_NAME
  const suffix = isEn ? 'Horsebean Private Server' : SITE_NAME

  /* 两个语言的路径去掉 en/ 前缀后配对，hreflang 才不会指向对方不存在的路径 */
  const zhPath = isEn ? path.slice(3) : path

  return {
    title: absolute ? { absolute: title } : title,
    description: desc,
    alternates: {
      canonical: canon,
      languages: {
        zh: `${SITE_URL}/${zhPath}`,
        en: `${SITE_URL}/en/${zhPath}`,
        'x-default': `${SITE_URL}/en/${zhPath}`
      }
    },
    openGraph: {
      title: absolute ? title : `${title} | ${suffix}`,
      description: desc,
      url: canon,
      siteName,
      locale: isEn ? SITE_LOCALE_ALT : SITE_LOCALE
    }
  }
}
