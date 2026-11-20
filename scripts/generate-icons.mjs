#!/usr/bin/env node
/**
 * 从源 logo (avif) 生成所有需要的图标文件:
 *   - favicon.ico          (32×32)
 *   - apple-icon.png       (180×180)
 *   - icon-192.png         (192×192, PWA)
 *   - icon-512.png         (512×512, PWA/Android maskable)
 *   - og-logo.png          (1200×630, OG 分享图)
 *
 * OG 图原来是 512×512，和 icon-512.png 同尺寸同源，两个文件 md5 一模一样。
 * 现在按 Open Graph 推荐的 1.91:1 出横图，社交卡片也不会再被裁成方块。
 *
 * 运行: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SOURCE = join(ROOT, 'public', 'assets', 'images', 'logo', 'logo.avif')
const APP_DIR = join(ROOT, 'src', 'app')
const PUBLIC_DIR = join(ROOT, 'public')

const TASKS = [
  // Next.js App Router icon convention: src/app/favicon.ico
  { out: join(APP_DIR, 'favicon.ico'), width: 32, height: 32, format: 'png' },
  // Apple touch icon: src/app/apple-icon.png
  { out: join(APP_DIR, 'apple-icon.png'), width: 180, height: 180, format: 'png' },
  // PWA icons: public/
  { out: join(PUBLIC_DIR, 'icon-192.png'), width: 192, height: 192, format: 'png' },
  { out: join(PUBLIC_DIR, 'icon-512.png'), width: 512, height: 512, format: 'png' },
  // OG share image: 1.91:1（社交卡片标准比）。圆形 logo 缩到 1200 宽只剩一条细带，
  // 铺浅底居中留白比铺满更像卡片；透明底在部分平台会发灰。
  {
    out: join(PUBLIC_DIR, 'og-logo.png'),
    width: 1200,
    height: 630,
    format: 'png',
    background: { r: 247, g: 247, b: 247, alpha: 1 }
  }
]

async function main() {
  console.log('[icons] Source:', SOURCE)

  for (const task of TASKS) {
    const pipeline = sharp(SOURCE).resize(task.width, task.height, {
      fit: 'contain',
      background: task.background || { r: 0, g: 0, b: 0, alpha: 0 }
    })

    if (task.format === 'png') {
      // palette: 图标本身颜色很少，调色板量化无损观感但体积降一个量级（712K → 167K）
      await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(task.out)
    }

    console.log(`[icons] Generated ${task.out} (${task.width}×${task.height})`)
  }

  console.log('[icons] Done!')
}

main().catch((err) => {
  console.error('[icons] Error:', err)
  process.exit(1)
})
