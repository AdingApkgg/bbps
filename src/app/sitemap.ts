import { execFileSync } from 'node:child_process'
import type { MetadataRoute } from 'next'
import { NAV_SEGMENTS } from '@/lib/nav-items'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * 静态页面路由 —— 首页 + 导航表 + 不进导航的政策页。
 *
 * 导航段名从 `lib/nav-items` 取，别在这里手抄：之前手抄漏了 /music/，
 * sitemap 少收录一个真页面。`ds-lab` 是一次性组件验证页，刻意不收。
 */
const EXTRA_ROUTES = ['/privacy-policy/', '/server-rules/', '/donate/']
const STATIC_ROUTES = ['/', ...NAV_SEGMENTS.map((s) => `/${s}/`), ...EXTRA_ROUTES]

/**
 * 取路由最后一次真实改动时间。
 *
 * 原来一律用 `new Date()`，于是每次部署全部页面都宣称「刚刚改过」，
 * 权重信号等于没有。这里按文件翻 git 历史；拿不到（无 .git、浅克隆、
 * 文件从未提交）就返回 undefined —— 省略 lastModified 比塞个假值好。
 */
function lastCommit(path: string): string | undefined {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', path], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return iso || undefined
  } catch {
    return undefined
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) => {
    // 路由 → 源文件：/music/ 对应 src/app/music/page.tsx
    const source = `src/app/${route === '/' ? '' : route.replace(/^\/|\/$/g, '')}page.tsx`
    const lastModified = lastCommit(source)
    const isHome = route === '/'

    return [
      {
        url: `${SITE_URL}${route}`,
        lastModified,
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : 0.8
      },
      {
        // 英文镜像必须带尾斜杠，和 trailingSlash: true 的产物一致
        url: `${SITE_URL}/en${route}`,
        lastModified,
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 0.9 : 0.7
      }
    ]
  })

  /* 文章正文托管在 blog.30hb.cn，由该站自己的 sitemap 收录，此处不再列出 */
  return staticEntries
}
