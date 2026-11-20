/**
 * 构建期响应式图片管线。
 *
 * `output: 'export'` 下 Next 的图片优化 API 不存在，仓库原本靠
 * `images.unoptimized: true` 把 `<Image>` 降级成裸 `<img>` —— 于是 15 张
 * 2558×1442 的画廊图在手机上也要先说下 700KB~1.1MB 的原图。
 *
 * 两条常见绕法都不成立（实测）：
 *  - Cloudflare `/cdn-cgi/image/`：源是 AVIF 时直接 `415 unsupported format`，
 *    而画廊和英雄图全是 AVIF；
 *  - 直接传 `srcSet` 给 `<Image>`：unoptimized 分支会把 srcSet/sizes 一起丢掉
 *    （`next/dist/shared/lib/get-img-props.js` 的 `generateImgAttrs`）。
 *
 * 所以走正规做法：`images.loaderFile` 自定义 loader + 这里在 prebuild 阶段
 * 预生成多档 WebP，loader 把 width 映射到对应文件。原图保留，作 max-src 兜底。
 * 小图（<= 最小档）不生成，loader 会回落原图。
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { join, extname, relative, parse } from 'node:path'
import sharp from 'sharp'

/*
 * 档位必须等于 next.config.ts 的 `deviceSizes` + `imageSizes` 并集：
 * 小图标按显式 width 走的正是 imageSizes（28px logo 会取 112/176），
 * 只生成 deviceSizes 会留下一堆 404 的 srcSet 候选。改一处必须改另一处。
 */
const WIDTHS = [112, 176, 220, 400, 800, 1600]
const QUALITY = 82
const ROOTS = ['public/assets/images', 'public/blog']
const SOURCE_EXT = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg'])
/* 变体目录名，靠无扩展名特性天然被 readdirSync + extname 过滤掉 */
const OUT_DIR = '_w'

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== OUT_DIR) yield* walk(full)
    } else if (SOURCE_EXT.has(extname(entry.name).toLowerCase())) {
      yield full
    }
  }
}

let generated = 0
let skipped = 0

async function handle(file) {
  const { width } = await sharp(file).metadata()
  /* 只剩一档时（源图比最小档还小）多档化收益接近 0，跳过以免空目录噪音 */
  if (!width || width <= WIDTHS[1]) {
    skipped++
    return
  }
  const parsed = parse(file)
  const targetDir = join(parsed.dir, OUT_DIR)
  await mkdir(targetDir, { recursive: true })

  for (const w of WIDTHS) {
    const target = join(targetDir, `${parsed.name}-${w}.webp`)
    const out = await sharp(file)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(target)
    generated++
    if (out.width !== w) skipped++
    void relative(process.cwd(), target)
  }
}

for (const root of ROOTS) {
  try {
    await stat(root)
  } catch {
    continue
  }
  for await (const file of walk(root)) await handle(file)
}

console.log(`[responsive-images] ${generated} 个变体生成，${skipped} 项跳过`)
