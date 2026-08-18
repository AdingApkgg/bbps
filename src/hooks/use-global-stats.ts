'use client'

import { useEffect, useState } from 'react'
import { fetchGlobalStatistics, type GlobalStatistics } from '@/lib/api'

export function useGlobalStats() {
  const [data, setData] = useState<GlobalStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 全服统计变化很慢，只在挂载时取一次，不轮询
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      try {
        const result = await fetchGlobalStatistics(controller.signal)
        if (cancelled) return
        setData(result)
        setError(false)
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) return
        setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return { data, loading, error }
}
