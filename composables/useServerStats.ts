import { ref } from 'vue'

interface OnlinePlayer {
  id: number
  name: string
}

interface ServerStats {
  m_v_avatar_seed: number
  m_v_replay_seed: number
  online_sessions: number
  online_player_list: OnlinePlayer[]
}

interface ApiResponse {
  success: boolean
  message: string
  body: ServerStats
  st: number
}

export const useServerStats = () => {
  const stats = ref<ServerStats | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        'https://vn-rank-api.adingapkgg.workers.dev/?target=https://webapi.30hb.cn/api/server',
        { cache: 'no-store' }
      )

      if (!response.ok) {
        throw new Error('Network error')
      }

      const data: ApiResponse = await response.json()

      if (!data.success || !data.body) {
        throw new Error('Invalid data format')
      }

      stats.value = data.body
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Failed to fetch server stats:', e)
    } finally {
      loading.value = false
    }
  }

  // 自动刷新
  let intervalId: NodeJS.Timeout | null = null

  const startAutoRefresh = (interval = 5000) => {
    fetchStats()
    intervalId = setInterval(fetchStats, interval)
  }

  const stopAutoRefresh = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
    startAutoRefresh,
    stopAutoRefresh
  }
}

