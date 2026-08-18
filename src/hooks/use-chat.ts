'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchChat, onlyChatMessages, type ChatEntry } from '@/lib/api'

/** 首屏一次性拉取量（接口上限 500，实测约 90KB） */
const INITIAL_LIMIT = 500
/** 轮询增量拉取量 —— 别用 500 轮询，那是首屏的用量 */
const POLL_LIMIT = 50
/** 接口目前没有限速，自觉别设太短 */
const POLL_INTERVAL = 12000
/** 前端保留上限，避免长时间挂着无限增长 */
const MAX_ENTRIES = 500

/** 按 seq 合并去重；seq 单调递增，直接当排序键和 React key */
function mergeBySeq(prev: ChatEntry[], incoming: ChatEntry[]): ChatEntry[] {
  if (incoming.length === 0) return prev
  const bySeq = new Map<number, ChatEntry>()
  for (const e of prev) bySeq.set(e.seq, e)
  for (const e of incoming) bySeq.set(e.seq, e)
  const merged = [...bySeq.values()].sort((a, b) => a.seq - b.seq)
  return merged.length > MAX_ENTRIES ? merged.slice(-MAX_ENTRIES) : merged
}

export function useChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const loadedOnceRef = useRef(false)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchChat(INITIAL_LIMIT)
      setEntries((prev) => mergeBySeq(prev, onlyChatMessages(data.entries)))
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // 轮询订阅：状态更新只发生在 await 之后，卸载后不再写入
  useEffect(() => {
    let cancelled = false

    const run = async (limit: number) => {
      try {
        const data = await fetchChat(limit)
        if (cancelled) return
        setEntries((prev) => mergeBySeq(prev, onlyChatMessages(data.entries)))
        setError(false)
        loadedOnceRef.current = true
      } catch {
        if (cancelled) return
        // 已经有数据时静默失败，不要把已渲染的聊天替换成错误页
        if (!loadedOnceRef.current) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run(INITIAL_LIMIT)
    const id = setInterval(() => run(POLL_LIMIT), POLL_INTERVAL)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { entries, loading, error, refresh }
}
