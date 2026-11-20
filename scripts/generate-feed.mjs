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

  /* 与 src/lib/http.ts 同一套连接策略：失败样本全在试 IPv6，且每次重试重建 TCP
     等于重新赌博。这里就地复制（脚本不能直接 import .ts），改一处记得改另一处。 */
  const { setDefaultResultOrder } = await import('node:dns')
  const { Agent, fetch } = await import('undici')
  setDefaultResultOrder('ipv4first')
  const agent = new Agent({
    connect: { timeout: 30_000 },
    keepAliveTimeout: 60_000,
    keepAliveMaxTimeout: 60_000,
    connections: 4
  })

  // 与 src/lib/blog.ts 同因：构建机到 blog.30hb.cn 常有 1/3 连接超时，
  // 没有退避就重试 1 次等于没重试
  const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 15000]
  let posts = []
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]))
    }
    try {
      const res = await fetch(`${WP_API}/posts?per_page=20&_embed`, {
        headers: { 'Content-Type': 'application/json' },
        dispatcher: agent
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      posts = Array.isArray(data) ? data : []
      break
    } catch (err) {
      console.warn(
        `[feed] 拉取失败（第 ${attempt + 1}/${RETRY_DELAYS_MS.length + 1} 次）：`,
        err.message
      )
    }
  }

  // 0 条就当作失败：页面那边是「抓不到就让构建失败」，
  // feed 静默产出空壳会让订阅者以为站点停更了（2026-11-21 已发生过一次）
  if (posts.length === 0) {
    console.error('[feed] 0 posts fetched — build 环境缺代理时 WordPress 抓不到')
    process.exit(1)
  }

  const now = new Date().toUTCString()

  const items = posts.map((post) => {
    const title = escapeXml(stripHtml(post.title?.rendered ?? ''))
    const description = escapeXml(stripHtml(post.excerpt?.rendered ?? ''))
    // 正文托管在 blog.30hb.cn，直接指向 WordPress 固定链接
    const link = post.link ?? `${WP_BLOG_URL}/${post.id}/`
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
