'use client'

import { useState, useCallback, useEffect } from 'react'
import { fetchServerStatus, type OnlinePlayer, type ServerStatusBody } from '@/lib/api'

const POLL_INTERVAL = 30000

export type { OnlinePlayer }
/** @deprecated 保留旧名，实际类型来自 lib/api */
export type ServerStatsBody = ServerStatusBody

export function useServerStats() {
  const [stats, setStats] = useState<ServerStatsBody | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setStats(await fetchServerStatus())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  // 轮询订阅外部数据源：状态更新只发生在 await 之后，且卸载后不再写入
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await fetchServerStatus()
        if (cancelled) return
        setStats(data)
        setError(null)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Unknown error')
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
