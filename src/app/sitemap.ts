import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
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

/** 路由 → 源文件。两种语言在 route group 里各有根目录（`(zh)` / `(en)/en`）。 */
function sourceFile(route: string, lang: 'zh' | 'en'): string {
  const page = route === '/' ? 'page.tsx' : `${route.replace(/^\/|\/$/g, '')}/page.tsx`
  return lang === 'zh' ? `src/app/(zh)/${page}` : `src/app/(en)/en/${page}`
}

/** route group 之前的老路径。页面都是从那儿整批搬进来的，旧史要接着算 */
function legacyFile(route: string, lang: 'zh' | 'en'): string {
  const page = route === '/' ? 'page.tsx' : `${route.replace(/^\/|\/$/g, '')}/page.tsx`
  return lang === 'zh' ? `src/app/${page}` : `src/app/en/${page}`
}

/** `/@/` 导入解析成磁盘路径；解析不出就返回 null */
const IMPORT_RE = /from '(@\/[^']+)'/g
const CANDIDATES = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

function resolveImport(specifier: string): string | null {
  const base = specifier.replace(/^@\//, 'src/')
  for (const suffix of CANDIDATES) {
    const path = base + suffix
    if (existsSync(path)) return path
  }
  return null
}

/** 页面自身 + 它直接 import 的本地模块（一跳）。再深会把半个仓库拖进来，收益递减 */
function relatedFiles(entry: string): string[] {
  const files = new Set([entry])
  let source = ''
  try {
    source = readFileSync(entry, 'utf8')
  } catch {
    return [...files]
  }
  for (const [, specifier] of source.matchAll(IMPORT_RE)) {
    const resolved = resolveImport(specifier)
    if (resolved) files.add(resolved)
  }
  return [...files]
}

/** 最后一次「内容改动」时间（只认 M，理由见 `lastModifiedOf`） */
function stampOf(path: string): string {
  try {
    return execFileSync('git', ['log', '-1', '--diff-filter=M', '--format=%cI', '--', path], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return ''
  }
}

/**
 * 取路由最后一次「内容改动」时间。
 *
 * 原来一律用 `new Date()`，于是每次部署全部页面都宣称「刚刚改过」，
 * 权重信号等于没有。这里按文件翻 git 历史。
 *
 * 三点讲究：
 * - 页面文件本身是薄壳（真样式与逻辑在 `src/components/`、`src/lib/`），只盯 page.tsx 会让
 *   所有页面共用一个时间戳。所以取「页面 + 它 import 的本地模块」里的最晚者。
 * - 只认 `M`（改内容）。整批搬进 route group 的那次提交把所有页面都重写了一遗，
 *   若把 `A`/`D` 也算上，全部页面会坍成同一个时间戳，信号又没了。
 * - 老路径也查（页面过去在老位置被改过）；老路径磁盘上已不存在，不能按 existsSync 过滤。
 * - 拿不到（无 .git、浅克隆、文件从未提交）就返回 undefined —— 省略 lastModified
 *   比塞个假值好。
 */
function lastModifiedOf(route: string, lang: 'zh' | 'en'): string | undefined {
  const current = sourceFile(route, lang)
  if (!existsSync(current)) {
    throw new Error(`[sitemap] 路由源文件不存在：${current}`)
  }

  const paths = [...relatedFiles(current), legacyFile(route, lang)]
  const stamps = paths.map(stampOf).filter(Boolean)
  /* 带时区偏移的 ISO 串不能直接字典序比，按真实时刻排 */
  return stamps.length === 0
    ? undefined
    : stamps.sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) => {
    const isHome = route === '/'
    /* 两种语言分别取各自的源文件时间：英文页常跟着中文页一起改，
       但共用一份时间戳会让中文页的改动也把英文页标成「刚更新」 */
    const zhModified = lastModifiedOf(route, 'zh')
    const enModified = lastModifiedOf(route, 'en')

    return [
      {
        url: `${SITE_URL}${route}`,
        lastModified: zhModified,
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : 0.8
      },
      {
        // 英文镜像必须带尾斜杠，和 trailingSlash: true 的产物一致
        url: `${SITE_URL}/en${route}`,
        lastModified: enModified,
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 0.9 : 0.7
      }
    ]
  })

  /* 文章正文托管在 blog.30hb.cn，由该站自己的 sitemap 收录，此处不再列出 */
  return staticEntries
}
