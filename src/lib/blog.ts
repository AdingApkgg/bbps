/**
 * WordPress REST API — 文章列表 & 单篇文章
 */

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

/** 按指定字段降序排序（返回新数组，不修改入参） */
export function sortPosts(posts: WPPost[], key: BlogSortKey): WPPost[] {
  return [...posts].sort((a, b) => {
    const diff = Date.parse(b[key]) - Date.parse(a[key])
    // 同值时用发布时间兜底，保证顺序稳定
    return diff !== 0 ? diff : Date.parse(b.date) - Date.parse(a.date)
  })
}

export async function fetchBlogPosts(
  options?: { perPage?: number; page?: number }
): Promise<WPPost[]> {
  const perPage = options?.perPage ?? 20
  const page = options?.page ?? 1
  const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed`

  const res = await fetch(url, {
    next: { revalidate: 600 },
    headers: { 'Content-Type': 'application/json' }
  })

  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`WordPress API error: ${res.status}`)
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
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
      const code = entity[1] === 'x' || entity[1] === 'X'
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
