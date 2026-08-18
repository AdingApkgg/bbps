import { Fragment } from 'react'

/**
 * 渲染含游戏变色标记的玩家昵称，如
 *   <c66FFFF>RTX </c><c77DDFF>509</c>
 *
 * 昵称完全由玩家自己设置，可含任意字符，所以这里**不使用** innerHTML /
 * dangerouslySetInnerHTML —— 一律走 React 的文本插值，天然转义。
 * 颜色只从 [0-9A-Fa-f]{6} 捕获后拼进 style，不接受任意 CSS。
 */

const SEGMENT_RE = /<c([0-9A-Fa-f]{6})>([\s\S]*?)<\/c>/g
/** 剥离残留的孤立标记（未闭合、或 </c> 多出来的情况） */
const STRAY_TAG_RE = /<\/?c(?:[0-9A-Fa-f]{6})?>/g

export interface NameSegment {
  text: string
  color?: string
}

/** 把带标记的昵称拆成 { 文本, 颜色 } 片段；纯逻辑，便于单独测试 */
export function parsePlayerName(raw: string): NameSegment[] {
  if (!raw || typeof raw !== 'string') return []

  const segments: NameSegment[] = []
  let lastIndex = 0

  SEGMENT_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SEGMENT_RE.exec(raw)) !== null) {
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

export function PlayerName({
  name,
  className,
  plain = false,
  fallback = '—'
}: PlayerNameProps) {
  const segments = parsePlayerName(name)
  const text = segments.map((s) => s.text).join('').trim()

  if (!text) return <span className={className}>{fallback}</span>
  if (plain) return <span className={className}>{text}</span>

  return (
    <span className={className} title={text}>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {seg.color ? (
            <span style={{ color: seg.color }}>{seg.text}</span>
          ) : (
            seg.text
          )}
        </Fragment>
      ))}
    </span>
  )
}
