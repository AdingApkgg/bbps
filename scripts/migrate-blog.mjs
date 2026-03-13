#!/usr/bin/env node
/**
 * WordPress XML → MDX 迁移脚本
 *
 * 用法:
 *   1. 从 WordPress 后台「工具 > 导出 > 所有内容」下载 XML
 *   2. 放到 scripts/ 目录
 *   3. pnpm migrate-blog scripts/WordPress.xml
 *
 * 产出:
 *   - src/content/blog/<slug>.mdx   (每篇文章)
 *   - public/blog/<filename>        (featured image)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'
import TurndownService from 'turndown'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_CONTENT_DIR = join(ROOT, 'src/content/blog')
const BLOG_IMAGE_DIR = join(ROOT, 'public/blog')

const SKIP_IDS = [349]

const SLUG_MAP = {
  754: 'multi-sc-server',
  607: 'supercell-animation',
  598: 'emeditor-csv',
  559: 'setup-brawl-stars',
  542: 'setup-clash-of-clans',
  501: 'setup-clash-royale',
  454: 'hb-boom-beach-changelog',
  412: 'supercell-texture-extractor',
  301: 'shanghai-travel-diary',
  287: 'setup-boom-beach',
  255: 'change-client-ip-sha',
  228: 'boom-beach-changelog',
  207: 'mongodb-import-export',
  174: 'setup-30hb-local',
  143: 'deploy-30hb-server',
  46: 'some-help',
  44: 'important-notice',
  37: 'common-commands',
}

async function main() {
  const xmlPath = process.argv[2]
  if (!xmlPath) {
    console.error('用法: node scripts/migrate-blog.mjs <wordpress-export.xml>')
    process.exit(1)
  }

  const xmlContent = await readFile(xmlPath, 'utf-8')

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    textNodeName: '#text',
    processEntities: true,
    htmlEntities: true,
  })

  const parsed = parser.parse(xmlContent)
  const channel = parsed.rss.channel
  const items = Array.isArray(channel.item) ? channel.item : [channel.item]

  const attachments = new Map()
  const posts = []

  for (const item of items) {
    const postType = extractCdata(item['wp:post_type'])
    if (postType === 'attachment') {
      const id = Number(item['wp:post_id'])
      const url = extractCdata(item['wp:attachment_url'])
      if (id && url) attachments.set(id, url)
    } else if (postType === 'post') {
      const id = Number(item['wp:post_id'])
      const status = extractCdata(item['wp:status'])
      if (status !== 'publish') continue
      if (SKIP_IDS.includes(id)) continue
      posts.push(item)
    }
  }

  console.log(`找到 ${posts.length} 篇已发布文章，${attachments.size} 个附件`)

  await mkdir(BLOG_CONTENT_DIR, { recursive: true })
  await mkdir(BLOG_IMAGE_DIR, { recursive: true })

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  })

  td.addRule('wpCaption', {
    filter: (node) =>
      node.nodeName === 'DIV' &&
      (node.getAttribute('class') || '').includes('wp-caption'),
    replacement: (_content, node) => {
      const img = node.querySelector('img')
      const caption = node.querySelector('.wp-caption-text')
      if (!img) return _content
      const src = img.getAttribute('data-original') || img.getAttribute('src') || ''
      const alt = caption ? caption.textContent : img.getAttribute('alt') || ''
      return `\n\n![${alt}](${src})\n\n`
    },
  })

  const redirects = []

  for (const item of posts) {
    const id = Number(item['wp:post_id'])
    const rawTitle = extractText(item.title)
    const dateStr = extractCdata(item['wp:post_date'])
    const date = new Date(dateStr).toISOString().slice(0, 10)

    const rawContent = extractCdata(item['content:encoded'])
    const rawExcerpt = extractCdata(item['excerpt:encoded'])

    let thumbnailId = null
    const metas = Array.isArray(item['wp:postmeta'])
      ? item['wp:postmeta']
      : item['wp:postmeta']
        ? [item['wp:postmeta']]
        : []
    for (const meta of metas) {
      if (extractCdata(meta['wp:meta_key']) === '_thumbnail_id') {
        thumbnailId = Number(extractCdata(meta['wp:meta_value']))
      }
    }

    const slug = SLUG_MAP[id] || `post-${id}`

    let featuredImage = ''
    if (thumbnailId && attachments.has(thumbnailId)) {
      const imageUrl = attachments.get(thumbnailId)
      const ext = extname(new URL(imageUrl).pathname) || '.png'
      const localFilename = `${slug}${ext}`
      const localPath = join(BLOG_IMAGE_DIR, localFilename)

      try {
        console.log(`  下载图片: ${imageUrl}`)
        const res = await fetch(imageUrl, { redirect: 'follow' })
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer())
          await writeFile(localPath, buf)
          featuredImage = `/blog/${localFilename}`
          console.log(`  ✓ 已保存: ${localPath}`)
        } else {
          console.warn(`  ✗ 下载失败 (${res.status}): ${imageUrl}`)
        }
      } catch (err) {
        console.warn(`  ✗ 下载出错: ${err.message}`)
      }
    }

    let markdown = td.turndown(rawContent || '')
    markdown = markdown
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const excerpt = rawExcerpt
      ? td.turndown(rawExcerpt).replace(/\n/g, ' ').trim()
      : markdown.slice(0, 120).replace(/\n/g, ' ')

    const frontmatter = [
      '---',
      `title: "${rawTitle.replace(/"/g, '\\"')}"`,
      `date: "${date}"`,
      `slug: "${slug}"`,
      `excerpt: "${excerpt.replace(/"/g, '\\"').slice(0, 200)}"`,
    ]
    if (featuredImage) {
      frontmatter.push(`featuredImage: "${featuredImage}"`)
    }
    frontmatter.push(`wpId: ${id}`)
    frontmatter.push('---')

    const mdxContent = frontmatter.join('\n') + '\n\n' + markdown + '\n'
    const mdxPath = join(BLOG_CONTENT_DIR, `${slug}.mdx`)
    await writeFile(mdxPath, mdxContent, 'utf-8')
    console.log(`✓ ${slug}.mdx (id=${id}) — ${rawTitle}`)

    redirects.push({ id, slug })
  }

  console.log('\n--- 迁移完成 ---')
  console.log(`共迁移 ${posts.length} 篇文章`)
  console.log(`\n旧链接重定向映射 (用于 next.config.ts):`)
  for (const { id, slug } of redirects) {
    console.log(`  /blog/${id} → /blog/${slug}`)
  }
}

function extractText(node) {
  if (typeof node === 'string') return node
  if (node && typeof node === 'object') {
    return node.__cdata || node['#text'] || String(node)
  }
  return String(node ?? '')
}

function extractCdata(node) {
  if (typeof node === 'string') return node
  if (node && typeof node === 'object') {
    return node.__cdata || node['#text'] || ''
  }
  return ''
}

main().catch((err) => {
  console.error('迁移失败:', err)
  process.exit(1)
})
