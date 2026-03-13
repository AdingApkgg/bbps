#!/usr/bin/env node
/**
 * 构建后生成 RSS 2.0 feed (feed.xml)
 * 从本地 MDX 文件读取博客文章
 * 使用方式: node scripts/generate-feed.mjs
 */

import { readdir, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { readdirSync } from 'node:fs'

const SITE_URL = 'https://30hb.cn'
const SITE_NAME = '蚕豆私服'
const SITE_DESCRIPTION = '非官方的海岛奇兵私服，体验无限资源和独特玩法'
const BLOG_DIR = join(process.cwd(), 'src/content/blog')

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const fm = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    fm[key] = val
  }
  return fm
}

function main() {
  console.log('[feed] Reading local MDX blog posts...')

  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  const posts = []

  for (const file of files) {
    const source = readFileSync(join(BLOG_DIR, file), 'utf-8')
    const fm = parseFrontmatter(source)
    if (!fm || !fm.title) continue
    posts.push(fm)
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const now = new Date().toUTCString()

  const items = posts.map((post) => {
    const title = escapeXml(post.title)
    const description = escapeXml((post.excerpt ?? '').slice(0, 200))
    const link = `${SITE_URL}/blog/${post.slug}/`
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

  const outDir = join(process.cwd(), 'out')
  const outPath = join(outDir, 'feed.xml')

  try {
    writeFileSync(outPath, xml, 'utf-8')
    console.log(`[feed] Generated ${outPath} with ${posts.length} items`)
  } catch {
    const publicPath = join(process.cwd(), 'public', 'feed.xml')
    writeFileSync(publicPath, xml, 'utf-8')
    console.log(`[feed] Generated ${publicPath} with ${posts.length} items`)
  }
}

main()
