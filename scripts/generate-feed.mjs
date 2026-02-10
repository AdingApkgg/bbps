#!/usr/bin/env node
/**
 * 构建后生成 RSS 2.0 feed (feed.xml)
 * 使用方式: node scripts/generate-feed.mjs
 */

const SITE_URL = 'https://30hb.cn'
const SITE_NAME = '蚕豆私服'
const SITE_DESCRIPTION = '非官方的海岛奇兵私服，体验无限资源和独特玩法'
const WP_BLOG_URL = process.env.NEXT_PUBLIC_WP_BLOG_URL ?? 'https://blog.30hb.cn'
const WP_API = `${WP_BLOG_URL}/wp-json/wp/v2`

/** 去除 HTML 标签 */
function stripHtml(html) {
  if (typeof html !== 'string') return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/** 转义 XML 特殊字符 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function main() {
  console.log('[feed] Fetching blog posts...')

  let posts = []
  try {
    const res = await fetch(`${WP_API}/posts?per_page=20&_embed`, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json()
      posts = Array.isArray(data) ? data : []
    }
  } catch (err) {
    console.warn('[feed] Failed to fetch posts:', err.message)
  }

  const now = new Date().toUTCString()

  const items = posts.map((post) => {
    const title = escapeXml(stripHtml(post.title?.rendered ?? ''))
    const description = escapeXml(stripHtml(post.excerpt?.rendered ?? ''))
    const link = `${SITE_URL}/blog/${post.id}/`
    const pubDate = new Date(post.date).toUTCString()

    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`

  const { writeFileSync } = await import('node:fs')
  const { join } = await import('node:path')

  // 写入 out/ 目录（静态导出产物）
  const outDir = join(process.cwd(), 'out')
  const outPath = join(outDir, 'feed.xml')

  try {
    writeFileSync(outPath, xml, 'utf-8')
    console.log(`[feed] Generated ${outPath} with ${posts.length} items`)
  } catch {
    // out/ 目录可能尚未存在，尝试写入 public/
    const publicPath = join(process.cwd(), 'public', 'feed.xml')
    writeFileSync(publicPath, xml, 'utf-8')
    console.log(`[feed] Generated ${publicPath} with ${posts.length} items`)
  }
}

main().catch((err) => {
  console.error('[feed] Error:', err)
  process.exit(1)
})
