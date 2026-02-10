#!/usr/bin/env node
/**
 * 从源 logo (avif) 生成所有需要的图标文件:
 *   - favicon.ico          (32×32)
 *   - apple-icon.png       (180×180)
 *   - icon-192.png         (192×192, PWA)
 *   - icon-512.png         (512×512, PWA)
 *   - og-logo.png          (512×512, OG 分享图)
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
  { out: join(APP_DIR, 'favicon.ico'), size: 32, format: 'png' },
  // Apple touch icon: src/app/apple-icon.png
  { out: join(APP_DIR, 'apple-icon.png'), size: 180, format: 'png' },
  // PWA icons: public/
  { out: join(PUBLIC_DIR, 'icon-192.png'), size: 192, format: 'png' },
  { out: join(PUBLIC_DIR, 'icon-512.png'), size: 512, format: 'png' },
  // OG share image (PNG for better compatibility)
  { out: join(PUBLIC_DIR, 'og-logo.png'), size: 512, format: 'png' }
]

async function main() {
  console.log('[icons] Source:', SOURCE)

  for (const task of TASKS) {
    const pipeline = sharp(SOURCE).resize(task.size, task.size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })

    if (task.format === 'png') {
      await pipeline.png().toFile(task.out)
    }

    console.log(`[icons] Generated ${task.out} (${task.size}×${task.size})`)
  }

  console.log('[icons] Done!')
}

main().catch((err) => {
  console.error('[icons] Error:', err)
  process.exit(1)
})
