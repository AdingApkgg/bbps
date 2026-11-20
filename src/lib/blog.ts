/**
 * WordPress REST API — 文章列表 & 单篇文章
 */
import { fetchWithBackoff } from '@/lib/http'

const WP_BLOG_URL = process.env.NEXT_PUBLIC_WP_BLOG_URL ?? 'https://blog.30hb.cn'
const WP_API = `${WP_BLOG_URL}/wp-json/wp/v2`

/* ---------- 文章列表 ---------- */

export interface WPPost {
  id: number
  /** 发布时间 */
  date: string
  /** 最后更新时间 */
  modified: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>
  }
}

/**
 * 列表排序方式。
 *
 * 阅读量暂不可用：Argon 主题把浏览数存在 post meta 里，未注册 show_in_rest，
 * REST 返回的 meta 只有 footnotes，orderby 白名单也不含 views。
 * 待 WordPress 端开放该 meta 后，在此处加 'views' 即可。
 */
export type BlogSortKey = 'date' | 'modified'

export const BLOG_SORT_KEYS: BlogSortKey[] = ['date', 'modified']

/**
 * 列表页真正要用的字段。
 *
 * WP 一篇 post 带 40 多个键，`_embed` 还会塞进整份作者/媒体/术语对象，
 * 这些全部会序列化进 RSC flight 变成首屏 HTML —— 列表只用得上封面和两行文字。
 * 所以出站前在这里裁掉，列表组件也只认这个类型。
 */
export interface BlogPost {
  id: number
  link: string
  /** 纯文本标题（已去标签、解实体） */
  title: string
  /** 纯文本摘要 */
  excerpt: string
  /** 发布时间，供排序 */
  date: string
  /** 最后更新时间，供排序 */
  modified: string
  /** 封面图 URL，没有就为空 */
  thumb: string
}

/** 把 WP 原始对象裁成列表要的字段 */
function mapWpPost(post: WPPost): BlogPost {
  return {
    id: post.id,
    link: post.link,
    title: stripHtml(post.title?.rendered ?? ''),
    excerpt: stripHtml(post.excerpt?.rendered ?? ''),
    date: post.date,
    modified: post.modified,
    thumb: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''
  }
}

/** 按指定字段降序排序（返回新数组，不修改入参） */
export function sortPosts(posts: BlogPost[], key: BlogSortKey): BlogPost[] {
  return [...posts].sort((a, b) => {
    const diff = Date.parse(b[key]) - Date.parse(a[key])
    // 同值时用发布时间兜底，保证顺序稳定
    return diff !== 0 ? diff : Date.parse(b.date) - Date.parse(a.date)
  })
}

/**
 * 重试间隔（共 1 + RETRY_DELAYS.length 次尝试），仅用于网络层失败。
 *
 * 实测构建机到 blog.30hb.cn（Cloudflare）约 1/4 的请求连不上，单次失败就整体构建失败。
 * 连接策略（IPv4 优先 + keep-alive + 30s 超时）在 `src/lib/http.ts`。
 */
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 15000]

/** 拉取文章列表，已裁成列表页要用的字段 */
export async function fetchBlogPosts(options?: {
  perPage?: number
  page?: number
}): Promise<BlogPost[]> {
  const perPage = options?.perPage ?? 20
  const page = options?.page ?? 1
  const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed`

  /* 静态导出没有 ISR，revalidate 在这里不会触发；内容更新靠重新部署 */
  const res = await fetchWithBackoff(
    url,
    { headers: { 'Content-Type': 'application/json' } },
    RETRY_DELAYS_MS
  )

  /* 有状态码就是对方已答复，不再重试；只有 404（站点未配 WP）当空列表 */
  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`WordPress API error: ${res.status}`)
  }

  const data = await res.json()
  return Array.isArray(data) ? data.map(mapWpPost) : []
}

/* ---------- 工具 ---------- */

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  laquo: '«',
  raquo: '»',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”'
}

/** 解码 HTML 实体：WordPress 的 excerpt 会输出 &hellip;、&#8230; 等 */
function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const code =
        entity[1] === 'x' || entity[1] === 'X'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return HTML_ENTITIES[entity.toLowerCase()] ?? match
  })
}

/** 从 rendered HTML 中取出纯文本（去掉 HTML 标签并解码实体） */
export function stripHtml(html: string): string {
  if (typeof html !== 'string') return ''
  return decodeEntities(html.replace(/<[^>]*>/g, '')).trim()
}
