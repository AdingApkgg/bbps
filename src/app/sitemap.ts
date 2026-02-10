import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { fetchBlogPosts } from '@/lib/blog'

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
  '/privacy-policy/',
  '/server-rules/'
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

  /* ── 博客文章 ── */
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await fetchBlogPosts({ perPage: 50 })
    blogEntries = posts.flatMap((post) => [
      {
        url: `${SITE_URL}/blog/${post.id}/`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6
      },
      {
        url: `${SITE_URL}/en/blog/${post.id}/`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.5
      }
    ])
  } catch {
    /* WordPress 不可用时跳过博客条目 */
  }

  return [...staticEntries, ...blogEntries]
}
