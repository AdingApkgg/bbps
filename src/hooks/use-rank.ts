'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  fetchAllRanks,
  type LeaderboardScope,
  type RankData
} from '@/lib/rank'

const POLL_INTERVAL = 60000
const EMPTY_RANKS: RankData = {
  vp: [],
  megacrab: [],
  coe: [],
  casualties: []
}

export type { RankData }

/** 快照连同它属于哪一档一起存，切换档位时无需在 effect 里同步 setState 重置 */
interface Snapshot {
  scope: LeaderboardScope
  data: RankData
  error: string | null
}

export function useRank(scope: LeaderboardScope = 'GLOBAL') {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)

  // 只认当前档位的快照：切换档位时自然回到 loading，不会闪出上一档的数据
  const current = snapshot?.scope === scope ? snapshot : null
  const data = current?.data ?? null
  const error = current?.error ?? null
  const loading = current === null

  const fetchRanks = useCallback(async () => {
    try {
      setSnapshot({ scope, data: await fetchAllRanks(scope), error: null })
    } catch (e) {
      setSnapshot({
        scope,
        data: EMPTY_RANKS,
        error: e instanceof Error ? e.message : 'Unknown error'
      })
    }
  }, [scope])

  // 轮询订阅外部数据源：状态更新只发生在 await 之后，且卸载后不再写入
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const result = await fetchAllRanks(scope)
        if (cancelled) return
        setSnapshot({ scope, data: result, error: null })
      } catch (e) {
        if (cancelled) return
        setSnapshot({
          scope,
          data: EMPTY_RANKS,
          error: e instanceof Error ? e.message : 'Unknown error'
        })
      }
    }
    run()
    const id = setInterval(run, POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [scope])

  return { data, loading, error, fetchRanks }
}
