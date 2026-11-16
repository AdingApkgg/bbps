import type * as React from 'react'
import { Fragment } from 'react'

/**
 * 渲染含游戏变色标记的玩家昵称，如
 * <c66FFFF>RTX </c><c77DDFF>509</c>
 *
 * 昵称完全由玩家自己设置，可含任意字符，所以这里**不使用** innerHTML /
 * dangerouslySetInnerHTML —— 一律走 React 的文本插值，天然转义。
 * 颜色只从 [0-9A-Fa-f]{6} 捕获后拼进 style，不接受任意 CSS。
 */

const SEGMENT_RE = /<c([0-9A-Fa-f]{6})>([\s\S]*?)<\/c>/g
/** 剥离残留的孤立标记（未闭合、或 </c> 多出来的情况） */
const STRAY_TAG_RE = /<\/?c(?:[0-9A-Fa-f]{6})?>/g

/**
 * 正文实际压住的底色（layer-01 / card），按「亮, 暗」成对列出，键与 data-skin 一致。
 * 各皮肤的值必须与对应 css 的 --md-sys-color-surface-01/-02 保持一致。
 */
const LAYERS = [
  ['m2', '#ffffff', '#1e1e1e'],
  ['fluent', '#ffffff', '#292929'],
  ['carbon', '#ffffff', '#161616'],
  ['apple', '#ffffff', '#1c1c1e']
] as const
const SKIN_LAYERS: ReadonlyArray<readonly [string, string, string]> = LAYERS
/** 每个片段的 CSS 变量：各皮肤 × 明暗的可读色，交给 CSS 按当前皮肤/主题选 */
function segmentStyle(color: string): React.CSSProperties {
  return Object.fromEntries(
    SKIN_LAYERS.flatMap(([key, light, dark]) => [
      [`--seg-light-${key}`, readableColor(color, light)],
      [`--seg-dark-${key}`, readableColor(color, dark)]
    ])
  ) as React.CSSProperties
}

/** WCAG AA 正文阈值 */
const MIN_RATIO = 4.5

function channelToLinear(c: number): number {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return (
    0.2126 * channelToLinear((n >> 16) & 255) +
    0.7152 * channelToLinear((n >> 8) & 255) +
    0.0722 * channelToLinear(n & 255)
  )
}

function contrast(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function toHsl(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) / 6
      : max === g
        ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6
  return [h, s, l]
}

function toHex(h: number, s: number, l: number): string {
  const hue = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const parts = s === 0 ? [l, l, l] : [hue(p, q, h + 1 / 3), hue(p, q, h), hue(p, q, h - 1 / 3)]
  return `#${parts
    .map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'))
    .join('')}`
}

/**
 * 把玩家自选色压到能读：保留色相与饱和度，只沿亮度方向二分，
 * 直到对给定底色达到 4.5:1。已经达标的颜色原样返回。
 *
 * 之所以要算这么多套，是因为暗色主题走 prefers-color-scheme、皮肤走 data-skin，
 * 组件在渲染期两者都拿不到，只能把每个底色的可读色都写进 style，交给 CSS 选。
 */
export function readableColor(hex: string, background: string): string {
  if (contrast(hex, background) >= MIN_RATIO) return hex

  const [h, s, l] = toHsl(hex)
  // 深底往亮走、浅底往暗走；两个方向都要停在「刚好达标且最接近原色」处，
  // 否则一路推到底会变成纯黑/纯白，色相丢光。
  const towardsLight = luminance(background) < 0.5
  let low = towardsLight ? l : 0
  let high = towardsLight ? 1 : l
  let best = towardsLight ? '#ffffff' : '#000000'

  for (let i = 0; i < 12; i += 1) {
    const mid = (low + high) / 2
    const candidate = toHex(h, s, mid)
    if (contrast(candidate, background) >= MIN_RATIO) {
      best = candidate
      // 可行：向内收窄到更接近原色的那一侧
      if (towardsLight) high = mid
      else low = mid
    } else if (towardsLight) {
      low = mid
    } else {
      high = mid
    }
  }

  return best
}

export interface NameSegment {
 text: string
 color?: string
}

/** 把带标记的昵称拆成 { 文本, 颜色 } 片段；纯逻辑，便于单独测试 */
export function parsePlayerName(raw: string): NameSegment[] {
 if (!raw || typeof raw !== 'string') return []

 const segments: NameSegment[] = []
 let lastIndex = 0

 // matchAll 内部会克隆正则，不再需要手动重置模块级 /g 正则的 lastIndex
 for (const match of raw.matchAll(SEGMENT_RE)) {
 if (match.index > lastIndex) {
 const plain = raw.slice(lastIndex, match.index).replace(STRAY_TAG_RE, '')
 if (plain) segments.push({ text: plain })
 }
 const inner = match[2].replace(STRAY_TAG_RE, '')
 if (inner) segments.push({ text: inner, color: `#${match[1]}` })
 lastIndex = match.index + match[0].length
 }

 if (lastIndex < raw.length) {
 const tail = raw.slice(lastIndex).replace(STRAY_TAG_RE, '')
 if (tail) segments.push({ text: tail })
 }

 return segments
}

/** 去掉所有标记，取纯文本（用于 title、aria-label、搜索等） */
export function plainPlayerName(raw: string): string {
 return parsePlayerName(raw)
 .map((s) => s.text)
 .join('')
}

interface PlayerNameProps {
 name: string
 className?: string
 /** 为 true 时忽略颜色，只渲染纯文本 */
 plain?: boolean
 fallback?: string
}

export function PlayerName({ name, className, plain = false, fallback = '—' }: PlayerNameProps) {
 const segments = parsePlayerName(name)
 const text = segments
 .map((s) => s.text)
 .join('')
 .trim()

 if (!text) return <span className={className}>{fallback}</span>
 if (plain) return <span className={className}>{text}</span>

 return (
 <span className={className} title={text}>
 {segments.map((seg, i) => (
 <Fragment key={i}>
 {seg.color ? (
 <span
 className="mc-name-segment"
 style={segmentStyle(seg.color)}
 >
 {seg.text}
 </span>
 ) : (
 seg.text
 )}
 </Fragment>
 ))}
 </span>
 )
}
