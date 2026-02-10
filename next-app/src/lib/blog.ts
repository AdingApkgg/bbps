/**
 * WordPress REST API 文章列表
 * @see https://developer.wordpress.org/rest-api/reference/posts/
 */

const WP_BLOG_URL = process.env.NEXT_PUBLIC_WP_BLOG_URL ?? 'https://blog.30hb.cn'
const WP_API = `${WP_BLOG_URL}/wp-json/wp/v2`

export interface WPPost {
  id: number
  date: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>
  }
}

export async function fetchBlogPosts(options?: { perPage?: number; page?: number }): Promise<WPPost[]> {
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

/** 从 excerpt.rendered 中取出纯文本（去掉 HTML 标签） */
export function stripHtml(html: string): string {
  if (typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, '').trim()
}
