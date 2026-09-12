'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

const STORAGE_KEY = 'locale-pref'

interface LocaleCtx {
  /** 当前实际生效的语言（由 URL 决定） */
  locale: Locale
  /** 用户显式选过的语言；null 表示没选过，此时不做任何自动跳转 */
  pref: Locale | null
  /** 设置偏好并导航 */
  setPref: (p: Locale) => void
}

const LocaleContext = createContext<LocaleCtx>({
  locale: 'zh',
  pref: null,
  setPref: () => {}
})

/**
 * 根据浏览器语言推断 locale。
 *
 * 只用来**提示**（见 LocaleSuggestBar），不用来跳转 —— 猜错了用户还在原地，
 * 顶多多看一行字。自动跳转猜错则是把人带走，代价完全不同。
 *
 * 匹配的是中文，兜底是英文 —— 反过来写的话，日语、法语浏览器都会落到中文页，
 * 而他们读英文的可能性远大于中文。
 *
 * `startsWith('zh')` 把 zh-CN / zh-TW / zh-HK / zh-Hant 一并算作中文：
 * 站内只有简体一份，繁体用户看简体也好过被丢去英文页。
 *
 * 只看 navigator.language（首选语言），不翻 navigator.languages ——
 * 首选英文、次选中文的用户想要的是英文。
 */
export function detectBrowserLocale(): Locale {
  // 拿不到 navigator 时不做判断：根路径预渲染的就是中文，返回 zh 等于不提示
  if (typeof navigator === 'undefined') return 'zh'
  const lang = navigator.language || ''
  return lang.startsWith('zh') ? 'zh' : 'en'
}

/** 把当前 pathname 转到目标 locale 对应的路径 */
export function toLocalePath(pathname: string, target: Locale): string {
  // 去掉现有 /en 前缀
  const bare =
    pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname

  return target === 'en' ? (bare === '/' ? '/en' : `/en${bare}`) : bare
}

/* ── useSyncExternalStore 订阅 localStorage ── */

let prefListeners: Array<() => void> = []

function emitPrefChange() {
  for (const fn of prefListeners) fn()
}

function subscribePref(callback: () => void) {
  prefListeners.push(callback)
  return () => {
    prefListeners = prefListeners.filter((fn) => fn !== callback)
  }
}

function getPrefSnapshot(): Locale | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  // 旧版本存过 'system'，那时它表示「按浏览器语言猜」。自动跳转已经去掉，
  // 这个值不再有对应行为，按「没选过」处理
  if (stored === 'zh' || stored === 'en') return stored
  return null
}

function getPrefServerSnapshot(): Locale | null {
  return null
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // 当前 URL 决定的实际 locale
  const locale: Locale = useMemo(() => (pathname?.startsWith('/en') ? 'en' : 'zh'), [pathname])

  // 从 localStorage 读取偏好，无 setState-in-effect
  const pref = useSyncExternalStore(subscribePref, getPrefSnapshot, getPrefServerSnapshot)

  // 同步 <html lang="...">
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-Hans'
  }, [locale])

  /*
   * 首次挂载：只有用户**显式选过**语言时才跳转 —— 那是记住选择，不是猜测。
   *
   * 以前这里还会在 pref 为 system 时按 navigator.language 猜一个再跳，已去掉：
   *  1. 静态导出没有服务端做 Accept-Language 协商，猜测只能等 JS 挂载后发生，
   *     必然先把原页面闪出来一下；
   *  2. 自动跳转会挡住只从单一 locale 抓取的爬虫，另一语言版本可能进不了索引；
   *  3. 别人分享来的 /en 链接会被强行拽回中文页，这对收链接的人是纯粹的干扰。
   * 语言分流交给各页的 <link rel="alternate" hreflang> 和导航里的切换器。
   *
   * 直接读 localStorage，避免 hydration 闭包捕获到服务端快照 'system'。
   */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== 'zh' && stored !== 'en') return
    if (stored !== locale) {
      router.replace(toLocalePath(pathname ?? '/', stored))
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: 刻意只在挂载时跑一次
  }, [])

  const setPref = useCallback(
    (p: Locale) => {
      localStorage.setItem(STORAGE_KEY, p)
      emitPrefChange()
      if (p !== locale) {
        router.push(toLocalePath(pathname ?? '/', p))
      }
    },
    [locale, pathname, router]
  )

  const ctx = useMemo<LocaleCtx>(() => ({ locale, pref, setPref }), [locale, pref, setPref])

  return <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale
}

export function useLocalePref() {
  const { pref, setPref } = useContext(LocaleContext)
  return { pref, setPref }
}
