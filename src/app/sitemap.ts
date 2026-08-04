import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * 静态页面路由 —— 中文 + 英文镜像
 */
const STATIC_ROUTES = [
  '/',
  '/commands/',
  '/stats/',
  '/comments/',
  '/downloads/',
  '/rank/',
  '/blog/',
  '/teams/',
  '/community/',
  '/privacy-policy/',
  '/server-rules/',
  '/donate/',
  '/gallery/'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  /* ── 静态页面（中文 + 英文） ── */
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    (route) => [
      {
        url: `${SITE_URL}${route}`,
        lastModified: now,
        changeFrequency: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 1.0 : 0.8
      },
      {
        url: `${SITE_URL}/en${route}`,
        lastModified: now,
        changeFrequency: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 0.9 : 0.7
      }
    ]
  )

  /* 文章正文托管在 blog.30hb.cn，由该站自己的 sitemap 收录，此处不再列出 */
  return staticEntries
}
