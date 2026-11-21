/**
 * 少数「只能是字面颜色」的场合：`Viewport.themeColor` 与 WCAG 对比度计算。
 *
 * 这两处都吃不到 CSS 变量 —— `themeColor` 由 Next 序列化进 `<meta>`，`readableColor()`
 * 要在 JS 里算亮度。所以把 `styles/tokens.css` 里对应的调色板值在这里复述一份，
 * `bun run check:theme` 会比对两边是否一致（见 `scripts/check-theme-parity.mjs`）。
 *
 * 只放真正需要的：宁可在组件里用 `var(--hig-color-*)`，也别往这儿堆。
 */

/** `--hig-palette-white` */
export const PALETTE_WHITE = '#ffffff'

/** `--hig-palette-black` */
export const PALETTE_BLACK = '#000000'

/** `--hig-palette-neutral-048` */
export const PALETTE_NEUTRAL_048 = '#f2f2f7'

/** `--hig-palette-neutral-820` */
export const PALETTE_NEUTRAL_820 = '#1c1c1e'

/** `--hig-color-surface` 的亮 / 暗值（浏览器 UI 底色） */
export const SURFACE_LIGHT = PALETTE_NEUTRAL_048
export const SURFACE_DARK = PALETTE_BLACK

/** `--hig-color-surface-01` 的亮 / 暗值（分组列表底） */
export const SURFACE_01_LIGHT = PALETTE_WHITE
export const SURFACE_01_DARK = PALETTE_NEUTRAL_820
