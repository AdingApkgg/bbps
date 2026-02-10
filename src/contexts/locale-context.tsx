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

export type LocalePref = Locale | 'system'

const STORAGE_KEY = 'locale-pref'

interface LocaleCtx {
  /** 当前实际生效的语言（由 URL 决定） */
  locale: Locale
  /** 用户偏好：zh / en / system */
  pref: LocalePref
  /** 设置偏好并导航 */
  setPref: (p: LocalePref) => void
}

const LocaleContext = createContext<LocaleCtx>({
  locale: 'zh',
  pref: 'system',
  setPref: () => {}
})

/** 根据浏览器语言推断 locale */
function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'zh'
  const lang = navigator.language || ''
  return lang.startsWith('en') ? 'en' : 'zh'
}

/** 把当前 pathname 转到目标 locale 对应的路径 */
function toLocalePath(pathname: string, target: Locale): string {
  // 去掉现有 /en 前缀
  const bare =
    pathname === '/en'
      ? '/'
      : pathname.startsWith('/en/')
        ? pathname.slice(3) || '/'
        : pathname

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

function getPrefSnapshot(): LocalePref {
  const stored = localStorage.getItem(STORAGE_KEY) as LocalePref | null
  if (stored === 'zh' || stored === 'en' || stored === 'system') return stored
  return 'system'
}

function getPrefServerSnapshot(): LocalePref {
  return 'system'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // 当前 URL 决定的实际 locale
  const locale: Locale = useMemo(
    () => (pathname?.startsWith('/en') ? 'en' : 'zh'),
    [pathname]
  )

  // 从 localStorage 读取偏好，无 setState-in-effect
  const pref = useSyncExternalStore(subscribePref, getPrefSnapshot, getPrefServerSnapshot)

  // 首次挂载：按偏好跳转
  useEffect(() => {
    const target = pref === 'system' ? detectBrowserLocale() : pref
    if (target !== locale) {
      router.replace(toLocalePath(pathname ?? '/', target))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setPref = useCallback(
    (p: LocalePref) => {
      localStorage.setItem(STORAGE_KEY, p)
      emitPrefChange()
      const target = p === 'system' ? detectBrowserLocale() : p
      if (target !== locale) {
        router.push(toLocalePath(pathname ?? '/', target))
      }
    },
    [locale, pathname, router]
  )

  const ctx = useMemo<LocaleCtx>(
    () => ({ locale, pref, setPref }),
    [locale, pref, setPref]
  )

  return (
    <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale
}

export function useLocalePref() {
  const { pref, setPref } = useContext(LocaleContext)
  return { pref, setPref }
}
