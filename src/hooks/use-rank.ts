'use client'

import { useState, useCallback, useEffect } from 'react'
import { fetchAllRanks, type RankEntry } from '@/lib/rank'

export interface RankData {
  vp: RankEntry[]
  megacrab: RankEntry[]
  casualties: RankEntry[]
}

const POLL_INTERVAL = 60000
const EMPTY_RANKS: RankData = { vp: [], megacrab: [], casualties: [] }

export function useRank() {
  const [data, setData] = useState<RankData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRanks = useCallback(async () => {
    try {
      setData(await fetchAllRanks())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setData(EMPTY_RANKS)
    } finally {
      setLoading(false)
    }
  }, [])

  // 轮询订阅外部数据源：状态更新只发生在 await 之后，且卸载后不再写入
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const result = await fetchAllRanks()
        if (cancelled) return
        setData(result)
        setError(null)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Unknown error')
        setData(EMPTY_RANKS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    const id = setInterval(run, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchRanks
  }
}
