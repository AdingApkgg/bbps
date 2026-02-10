/**
 * WordPress REST API — 文章列表 & 单篇文章
 */

const WP_BLOG_URL = process.env.NEXT_PUBLIC_WP_BLOG_URL ?? 'https://blog.30hb.cn'
const WP_API = `${WP_BLOG_URL}/wp-json/wp/v2`

/* ---------- 文章列表 ---------- */

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

/* ---------- 单篇文章 ---------- */

export interface WPPostDetail {
  id: number
  date: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>
  }
}

export async function fetchBlogPost(
  postId: number | string
): Promise<WPPostDetail | null> {
  const url = `${WP_API}/posts/${postId}?_embed`
  const res = await fetch(url, {
    next: { revalidate: 600 },
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) return null
  return res.json()
}

/* ---------- 工具 ---------- */

/** 从 rendered HTML 中取出纯文本（去掉 HTML 标签） */
export function stripHtml(html: string): string {
  if (typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * 修复 WordPress 懒加载插件输出的 HTML：
 * - 将 data-original="真实URL" 还原到 src
 * - 移除 base64 占位图的 src
 * - 清理多余的懒加载 class
 */
export function fixWpLazyImages(html: string): string {
  if (!html) return html
  return html.replace(
    /<img\b[^>]*>/gi,
    (imgTag) => {
      // 提取 data-original 中的真实 URL
      const realSrc = imgTag.match(/data-original="([^"]+)"/)?.[1]
      if (!realSrc) return imgTag

      let fixed = imgTag
      // 移除所有 src="..." (可能有多个) 并替换为真实 URL
      fixed = fixed.replace(/\s*src="[^"]*"/g, '')
      // 移除 data-original
      fixed = fixed.replace(/\s*data-original="[^"]*"/, '')
      // 在 <img 后插入真实 src
      fixed = fixed.replace(/^<img/, `<img src="${realSrc}"`)
      // 清理懒加载 class
      fixed = fixed.replace(/\blazyload\b/g, '').replace(/\blazyload-style-\d+\b/g, '')
      // 清理多余空格
      fixed = fixed.replace(/class="\s+/g, 'class="').replace(/\s+"/g, '"')
      return fixed
    }
  )
}
