/**
 * 指令模板：解析 `<参数>` / `[可选参数]` 占位符，供表单填值后拼回完整指令。
 * 例：`/rename <名字>` → 一个文本段 + 一个必填参数。
 */

export interface TemplatePart {
  type: 'text' | 'param'
  value: string
  /** [] 包起来的是可选参数 */
  optional?: boolean
}

const PLACEHOLDER_RE = /<([^<>]+)>|\[([^\[\]]+)\]/g

/** 彩色字体那类条目本身就是 `<cRRGGBB>文字</c>`，不是占位符，别误判 */
const COLOR_TAG_RE = /^<\/?c(?:[0-9A-Fa-f]{6})?>$/

export function parseTemplate(command: string): TemplatePart[] {
  if (!command) return []
  const parts: TemplatePart[] = []
  let last = 0
  PLACEHOLDER_RE.lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = PLACEHOLDER_RE.exec(command)) !== null) {
    if (COLOR_TAG_RE.test(m[0])) continue
    if (m.index > last) {
      parts.push({ type: 'text', value: command.slice(last, m.index) })
    }
    // `[<难度>]` 这种写法里，[] 捕获到的是 `<难度>`，要把尖括号剥掉，
    // 否则参数名跟表单里的键对不上，填了值也会被当成空
    const raw = (m[1] ?? m[2] ?? '').trim()
    parts.push({
      type: 'param',
      value: raw.replace(/^<|>$/g, '').trim(),
      optional: m[2] !== undefined
    })
    last = m.index + m[0].length
  }

  if (last < command.length) {
    parts.push({ type: 'text', value: command.slice(last) })
  }
  return parts
}

/** 该指令是否需要填参数 */
export function hasParams(command: string): boolean {
  return parseTemplate(command).some((p) => p.type === 'param')
}

/** 用填好的值拼回指令；未填的可选参数直接丢弃 */
export function fillTemplate(
  command: string,
  values: Record<string, string>
): string {
  const parts = parseTemplate(command)
  if (!parts.some((p) => p.type === 'param')) return command
  return parts
    .map((p) => {
      if (p.type === 'text') return p.value
      const v = (values[p.value] ?? '').trim()
      return v || (p.optional ? '' : `<${p.value}>`)
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** 参数是否都已填妥（可选参数不算） */
export function isTemplateReady(
  command: string,
  values: Record<string, string>
): boolean {
  return parseTemplate(command)
    .filter((p) => p.type === 'param' && !p.optional)
    .every((p) => (values[p.value] ?? '').trim().length > 0)
}

/** 能否通过网页执行：彩色字体片段等非 `/` 开头的条目只能复制 */
export function isRunnable(command: string): boolean {
  return command.trim().startsWith('/')
}
