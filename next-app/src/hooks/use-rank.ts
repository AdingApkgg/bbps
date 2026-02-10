'use client'

import { useState, useCallback, useEffect } from 'react'
import { fetchAllRanks, type RankEntry } from '@/lib/rank'

export interface RankData {
  vp: RankEntry[]
  megacrab: RankEntry[]
  casualties: RankEntry[]
}

export function useRank() {
  const [data, setData] = useState<RankData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRanks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchAllRanks()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setData({ vp: [], megacrab: [], casualties: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRanks()
    const id = setInterval(fetchRanks, 60000)
    return () => clearInterval(id)
  }, [fetchRanks])

  return {
    data,
    loading,
    error,
    fetchRanks
  }
}
