import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

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
  '/donate/'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

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

  const posts = await getAllPosts()
  const blogEntries: MetadataRoute.Sitemap = posts.flatMap((post) => [
    {
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    {
      url: `${SITE_URL}/en/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.5
    }
  ])

  return [...staticEntries, ...blogEntries]
}
