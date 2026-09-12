'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import {
  detectBrowserLocale,
  toLocalePath,
  useLocale,
  useLocalePref
} from '@/contexts/locale-context'
import type { Locale } from '@/lib/i18n'

/**
 * 「本站有你的语言版本」提示条。
 *
 * 站点是静态导出，没有服务端做 Accept-Language 协商，所以不做自动跳转
 * （猜错会把人带走，还会挡住只从单一 locale 抓取的爬虫）。改成提示：
 * 猜错了用户也还在原地，顶多多看一行字。
 *
 * 文案用的是**目标**语言 —— 看不懂当前页面的人，才是这条提示要找的人。
 */
const COPY: Record<Locale, { text: string; action: string; dismiss: string }> = {
  en: {
    text: 'This page is also available in English.',
    action: 'Switch to English',
    dismiss: 'Dismiss'
  },
  zh: {
    text: '本站有中文版本。',
    action: '切换到中文',
    dismiss: '关闭'
  }
}

const DISMISS_KEY = 'locale-suggest-dismissed'

let listeners: Array<() => void> = []

function subscribe(callback: () => void): () => void {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((fn) => fn !== callback)
  }
}

function getDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    // 隐私模式下读不到，当作已关闭 —— 提示条不重要到值得冒报错的风险
    return true
  }
}

/**
 * 服务端一律当作「已关闭」，静态 HTML 里就不会烘焙进这条提示。
 * 否则预渲染的 /en 页面会对所有人带上「有中文版本」，还会 hydration 不匹配。
 */
function getDismissedServerSnapshot(): boolean {
  return true
}

function dismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {
    /* 存不下也无所谓，最多下次再出现一遍 */
  }
  listeners.forEach((fn) => {
    fn()
  })
}

export function LocaleSuggestBar() {
  const locale = useLocale()
  const pathname = usePathname()
  const { pref, setPref } = useLocalePref()
  const dismissed = useSyncExternalStore(
    subscribe,
    getDismissed,
    getDismissedServerSnapshot
  )

  // 选过语言的人不需要被提示；关掉过的也不再打扰
  if (pref || dismissed) return null

  const suggested = detectBrowserLocale()
  if (suggested === locale) return null

  const copy = COPY[suggested]

  return (
    <div className="border-b bg-muted/50" lang={suggested === 'en' ? 'en' : 'zh-Hans'}>
      <div className="container mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2 text-sm">
        <p className="text-muted-foreground">{copy.text}</p>
        <Link
          href={toLocalePath(pathname ?? '/', suggested)}
          onClick={() => setPref(suggested)}
          className="font-medium underline underline-offset-4"
        >
          {copy.action}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.dismiss}
          className="ml-auto shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
