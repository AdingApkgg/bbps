/** 展示用的格式化工具 */

/**
 * 解析服务端的运行时长。
 * /api/server 的 server_uptime 是 .NET TimeSpan 字符串，形如
 * "00:39:02.5880780" 或跨天的 "3.04:15:00"，不是秒数。
 */
export function parseUptimeSeconds(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null
  if (typeof raw !== 'string') return null
  const m = raw.match(/^(?:(\d+)\.)?(\d+):(\d{2}):(\d{2})(?:\.\d+)?$/)
  if (!m) return null
  const [, d, h, mi, sec] = m
  return (
    Number(d ?? 0) * 86400 +
    Number(h) * 3600 +
    Number(mi) * 60 +
    Number(sec)
  )
}

/** 秒 → 「3天 4小时 5分」 */
export function formatDuration(seconds: number, locale: string): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '—'
  const s = Math.floor(seconds)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const en = locale === 'en'
  const parts: string[] = []
  if (d) parts.push(en ? `${d}d` : `${d} 天`)
  if (h) parts.push(en ? `${h}h` : `${h} 小时`)
  if (m || parts.length === 0) parts.push(en ? `${m}m` : `${m} 分`)
  return parts.join(' ')
}

/** 字节 → 「1.2 GB」 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`
}

/** 大数字 → 「4.77 万亿 / 4.77T」，用于掠夺资源这类天文数字 */
export function formatCompact(n: number, locale: string): string {
  if (!Number.isFinite(n)) return '—'
  if (locale === 'en') {
    const units: [number, string][] = [
      [1e12, 'T'],
      [1e9, 'B'],
      [1e6, 'M'],
      [1e3, 'K']
    ]
    for (const [base, suffix] of units) {
      if (Math.abs(n) >= base) return `${(n / base).toFixed(2)}${suffix}`
    }
    return n.toLocaleString('en-US')
  }
  const units: [number, string][] = [
    [1e12, '万亿'],
    [1e8, '亿'],
    [1e4, '万']
  ]
  for (const [base, suffix] of units) {
    if (Math.abs(n) >= base) return `${(n / base).toFixed(2)} ${suffix}`
  }
  return n.toLocaleString('zh-CN')
}

/**
 * 服务端时间 → 本地时间。
 *
 * 两种格式都要吃下：global_statistics 是 "2026-08-18 03:32:47"，
 * /api/server 的 datetime_utcnow 是 "2026/8/18 04:11:47"。
 * 两者都是 UTC —— 不显式按 UTC 解析的话会被当成本地时间，直接差 8 小时。
 */
export function formatServerTime(raw: string, locale: string): string {
  if (!raw) return '—'
  const m = raw.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/
  )
  if (!m) return raw
  const [, y, mo, d, h, mi, sec] = m
  const ts = Date.UTC(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(sec ?? 0)
  )
  if (Number.isNaN(ts)) return raw
  return new Date(ts).toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
