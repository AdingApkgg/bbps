'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

const BSZ_API = 'https://bsz.saop.cc/api'

/* ── 全局单例存储，确保多组件共享同一份数据且只请求一次 ── */

interface Stats {
  sitePv: number | null
  siteUv: number | null
  pagePv: number | null
}

let stats: Stats = { sitePv: null, siteUv: null, pagePv: null }
const listeners = new Set<() => void>()
let fetchedPathname = ''
let pending: Promise<void> | null = null

function getSnapshot(): Stats {
  return stats
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

function setStats(next: Stats) {
  stats = next
  listeners.forEach((cb) => cb())
}

function fetchStats(pathname: string) {
  // 同一路径只请求一次
  if (pathname === fetchedPathname) return
  fetchedPathname = pathname

  setStats({ ...stats, pagePv: null })

  pending = (async () => {
    try {
      const res = await fetch(BSZ_API, {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-bsz-referer': location.origin + pathname }
      })
      const json = await res.json()
      if (json.success && json.data) {
        setStats({
          sitePv: json.data.site_pv,
          siteUv: json.data.site_uv,
          pagePv: json.data.page_pv
        })
      }
    } catch {
      // silently ignore
    } finally {
      pending = null
    }
  })()
}

export function useVisitorStats() {
  const pathname = usePathname()
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    fetchStats(pathname)
  }, [pathname])

  return data
}
