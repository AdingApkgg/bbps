'use client'

import { useState, useCallback, useEffect } from 'react'

export interface OnlinePlayer {
  id: number
  name: string
}

export interface ServerStatsBody {
  type?: string
  server_version: string
  datetime_utcnow?: string
  use_patch?: boolean
  patch_sha?: string
  patch_url?: string
  save_mode?: string
  game_server_address?: string
  game_server_host_name?: string
  memory_used?: number
  m_v_avatar_seed: number
  m_v_replay_seed: number
  incoming_message_count?: number
  outgoing_message_count?: number
  online_connections?: number
  online_sessions: number
  online_player_list: OnlinePlayer[]
  refresh_api_objects_ms?: number
}

const API_URL = 'https://webapi.30hb.cn/api/server'

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
      const json = await res.json()
      const data: ServerStatsBody = json?.body ?? json
      if (!data.server_version) throw new Error('Invalid data')
      setStats(data)
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
    serverVersion: stats?.server_version ?? '',
    onlinePlayers: stats?.online_sessions ?? 0,
    totalPlayers: stats?.m_v_avatar_seed ?? 0,
    totalReplays: stats?.m_v_replay_seed ?? 0,
    players: stats?.online_player_list ?? []
  }
}
