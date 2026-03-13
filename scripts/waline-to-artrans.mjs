#!/usr/bin/env node
/**
 * Waline JSON → Artrans (Artalk) 转换脚本
 *
 * 用法: node scripts/waline-to-artrans.mjs scripts/waline-out.json
 *
 * 产出（按站点自动分文件）:
 *   scripts/artrans-disk.saop.cc.artrans
 *   scripts/artrans-blog.artrans
 *   ...
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_CONFIGS = {
  'disk.saop.cc': {
    siteName: '蚕豆网盘',
    siteUrl: 'https://disk.saop.cc',
    filename: 'artrans-disk.saop.cc.artrans',
    pageKeyTransform: (url) => url,
  },
  blog: {
    siteName: '蚕豆私服',
    siteUrl: 'https://30hb.cn',
    filename: 'artrans-blog.artrans',
    pageKeyTransform: (url) => url,
  },
}

function classifySite(url) {
  if (url === 'disk.saop.cc') return 'disk.saop.cc'
  return 'blog'
}

async function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error('用法: node scripts/waline-to-artrans.mjs <waline-out.json>')
    process.exit(1)
  }

  const raw = JSON.parse(await readFile(inputPath, 'utf-8'))
  const comments = raw.data?.Comment ?? []

  console.log(`读取 ${comments.length} 条 Waline 评论`)

  const grouped = {}
  for (const c of comments) {
    if (c.status !== 'approved') continue
    const site = classifySite(c.url ?? '')
    if (!grouped[site]) grouped[site] = []
    grouped[site].push(c)
  }

  for (const [siteKey, siteComments] of Object.entries(grouped)) {
    const config = SITE_CONFIGS[siteKey]
    if (!config) {
      console.warn(`未知站点: ${siteKey}，跳过 ${siteComments.length} 条`)
      continue
    }

    const idMap = new Map()
    let counter = 1

    const artrans = []

    for (const c of siteComments) {
      const oldId = c.objectId
      const newId = String(counter++)
      idMap.set(oldId, newId)

      // Waline 的 rid 是根评论 ID，pid 是直接父评论 ID
      // Artalk 的 rid 是直接父评论 ID
      let rid = '0'
      const parentId = c.pid || ''
      if (parentId && idMap.has(parentId)) {
        rid = idMap.get(parentId)
      }

      const createdAt = formatDate(c.insertedAt || c.createdAt)

      const pageKey = config.pageKeyTransform(c.url ?? '/')

      artrans.push({
        id: newId,
        rid,
        content: c.comment ?? '',
        ua: c.ua ?? '',
        ip: c.ip ?? '',
        created_at: createdAt,
        updated_at: createdAt,
        is_collapsed: 'false',
        is_pending: 'false',
        vote_up: String(c.like ?? 0),
        vote_down: '0',
        nick: c.nick ?? '匿名',
        email: c.mail ?? '',
        link: c.link ?? '',
        password: '',
        badge_name: '',
        badge_color: '',
        page_key: pageKey,
        page_title: '',
        page_admin_only: 'false',
        site_name: config.siteName,
        site_urls: config.siteUrl,
      })
    }

    const outPath = join(__dirname, config.filename)
    await writeFile(outPath, JSON.stringify(artrans, null, 2), 'utf-8')
    console.log(`✓ ${config.filename} — ${artrans.length} 条评论`)
  }

  console.log('\n转换完成，在 Artalk 后台「迁移」中导入 .artrans 文件即可')
}

function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

main().catch((err) => {
  console.error('转换失败:', err)
  process.exit(1)
})
