/**
 * 自定义图片 loader（`next.config.ts` 的 `images.loaderFile`）。
 *
 * 静态导出下没有优化端点，这个函数只在构建/渲染期算 URL：
 * `/assets/images/gallery/7.avif` + 800 → `/assets/images/gallery/_w/7-800.webp`，
 * 文件由 `scripts/responsive-images.mjs` 在 prebuild 里预生成。
 *
 * 远程图（WordPress 封面、Gravatar 头像）直接原样返回 —— 变体不存在。
 * 宽高不存在的兜底：`_w/` 里没生成过的档位返回原图，宁可多传也不能 404。
 */

interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

/** 只有站内 public 下这两处有预生成变体 */
const LOCAL_PREFIX = /^\/(assets\/images|blog)\//

export default function responsiveLoader({ src, width }: LoaderArgs): string {
  if (!LOCAL_PREFIX.test(src) || src.includes(`/_w/`)) return src

  const dot = src.lastIndexOf('.')
  if (dot < 0) return src
  const slash = src.lastIndexOf('/')
  return `${src.slice(0, slash)}/_w/${src.slice(slash + 1, dot)}-${width}.webp`
}
