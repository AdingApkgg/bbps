'use client'

import { useState, useCallback, useEffect } from 'react'

export interface OnlinePlayer {
  id: number
  name: string
}

export interface ServerStatsBody {
  m_v_avatar_seed: number
  m_v_replay_seed: number
  online_sessions: number
  online_player_list: OnlinePlayer[]
}

interface ApiResponse {
  success: boolean
  body: ServerStatsBody
}

const API_URL =
  'https://vn-rank-api.adingapkgg.workers.dev/?target=https://webapi.30hb.cn/api/server'

export function useServerStats() {
  const [stats, setStats] = useState<ServerStatsBody | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(API_URL, { cache: 'no-store' })
      if (!res.ok) throw new Error('Network error')
      const data: ApiResponse = await res.json()
      if (!data.success || !data.body) throw new Error('Invalid data')
      setStats(data.body)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const id = setInterval(fetchStats, 30000)
    return () => clearInterval(id)
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    fetchStats,
    onlinePlayers: stats?.online_sessions ?? 0,
    totalPlayers: stats?.m_v_avatar_seed ?? 0,
    totalReplays: stats?.m_v_replay_seed ?? 0,
    players: stats?.online_player_list ?? []
  }
}
