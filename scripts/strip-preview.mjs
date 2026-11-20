/**
 * 从产物里删掉本地截图预览。
 *
 * `scripts/shots.mjs` 把截图写进 `public/_preview/`，`next build` 会原样复制到
 * `out/`。那些图是合并前给人看对照用的，线上没人逛，但每次部署都在 Pages 里
 * 存一份新的（当前 1.1M）。
 *
 * 放在 build 末尾而不是挪走 shots 的输出目录：`public/` 下的路径能直接被
 * `next dev` 和 `bun run start` 预览，改到 `out/` 反而要先构建一次才能看图。
 */
import { rm } from 'node:fs/promises'

await rm('out/_preview', { recursive: true, force: true })
await rm('out/preview.html', { force: true })
console.log('[strip-preview] 已从 out/ 移除 _preview 与 preview.html')
