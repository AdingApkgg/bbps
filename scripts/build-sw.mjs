#!/usr/bin/env node
/**
 * 构建 Service Worker:
 * 1. esbuild 编译 + 打包 src/app/sw.ts → out/sw-bundle.js
 * 2. @serwist/build injectManifest 扫描 out/ 并注入预缓存清单 → out/sw.js
 */
import esbuild from 'esbuild'
import { injectManifest } from '@serwist/build'
import { unlinkSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = join(process.cwd(), 'out')
const BUNDLE_PATH = join(OUT_DIR, 'sw-bundle.js')

async function main() {
  // Step 1: 编译 TypeScript 并打包所有依赖
  console.log('[sw] Bundling src/app/sw.ts ...')
  await esbuild.build({
    entryPoints: ['src/app/sw.ts'],
    outfile: BUNDLE_PATH,
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2020',
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  })

  // Step 2: 注入预缓存清单
  console.log('[sw] Injecting precache manifest ...')
  const { count, size } = await injectManifest({
    swSrc: BUNDLE_PATH,
    swDest: join(OUT_DIR, 'sw.js'),
    globDirectory: OUT_DIR,
    // 只预缓存 app shell（JS/CSS + 首页 + PWA 图标）。
    // 图片、字体子集、长尾页面交给 sw.ts 的运行时缓存按访问缓存，
    // 避免首访就后台下载全站（曾达 230 文件 / 30 MB）。
    globPatterns: [
      '_next/static/**/*.{js,css}',
      'index.html',
      'manifest.json',
      'favicon.ico',
      'icon-192.png',
      'icon-512.png'
    ],
    globIgnores: [
      'sw-bundle.js',
      'sw.js',
      '_worker.js',
      '_next/static/development/**'
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB
  })

  // 清理中间文件
  try {
    unlinkSync(BUNDLE_PATH)
  } catch { /* ignore */ }

  console.log(`[sw] Generated out/sw.js — ${count} files, ${(size / 1024).toFixed(0)} KB total`)
}

main().catch((err) => {
  console.error('[sw] Error:', err)
  process.exit(1)
})
