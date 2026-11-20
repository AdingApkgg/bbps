'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchChat, onlyChatMessages, type ChatEntry } from '@/lib/api'
import { usePolling } from './use-polling'

/**
 * 首屏一次性拉取量。
 *
 * 接口上限是 500，但 500 条约 90KB JSON，全在客户端解，而聊天区一屏只露 6 条
 * —— 先拉 200 够把滚动区填满，剩下的在用户往下翻时补（见 loadMore）。
 */
const INITIAL_LIMIT = 200
/** 轮询增量拉取量 —— 别用首屏量轮询，那是首屏的用量 */
const POLL_LIMIT = 50
/** 「加载更多」每次多要的量 */
const MORE_LIMIT = 200
/** 接口目前没有限速，自觉别设太短 */
const POLL_INTERVAL = 12000
/** 前端保留上限，避免长时间挂着无限增长 */
const MAX_ENTRIES = 500
/** 每次多加的量 = MAX_ENTRIES/2，最多到 MAX_ENTRIES 就不再加 */
const MAX_LIMIT = 500
/** 自动刷新的偏好键；关掉只是不轮询，手动刷新照常 */
const STORAGE_POLL_KEY = 'bbps-chat-poll'

function loadPolling(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_POLL_KEY) !== 'off'
  } catch {
    return true
  }
}

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
  const [polling, setPollingState] = useState(true)
  /* 已请求过的窗口大小；「加载更多」会把它翻倍，到 MAX_LIMIT 封顶 */
  const [limit, setLimit] = useState(INITIAL_LIMIT)
  const [hasMore, setHasMore] = useState(true)
  const loadedOnceRef = useRef(false)
  // 首次 tick 走当前窗口，之后走增量；隐藏切回来时也算增量
  const firstTickRef = useRef(true)

  const setPolling = useCallback((next: boolean) => {
    setPollingState(next)
    try {
      window.localStorage.setItem(STORAGE_POLL_KEY, next ? 'on' : 'off')
    } catch {
      /* 隐私模式下不可用 */
    }
  }, [])

  // 偏好是外部存储，挂载后才读得到；先按默认 true 渲染，再对齐一次
  useEffect(() => {
    setPollingState(loadPolling())
  }, [])

  const refresh = useCallback(async () => {
    try {
      const data = await fetchChat(limit)
      setEntries((prev) => mergeBySeq(prev, onlyChatMessages(data.entries)))
      /* 服务端返回不足一整个窗口，说明已经到头 */
      setHasMore(data.entries.length >= limit && limit < MAX_LIMIT)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [limit])

  /** 往下翻时多要一段；窗口封顶后就不再请求新的一轮 */
  const loadMore = useCallback(() => {
    setLimit((prev) => (prev >= MAX_LIMIT ? prev : Math.min(prev + MORE_LIMIT, MAX_LIMIT)))
  }, [])

  // 轮询订阅：状态更新只发生在 await 之后，卸载后不再写入
  usePolling({
    intervalMs: POLL_INTERVAL,
    enabled: polling,
    run: async (signal) => {
      const take = firstTickRef.current ? limit : POLL_LIMIT
      firstTickRef.current = false
      try {
        const data = await fetchChat(take, signal)
        setEntries((prev) => mergeBySeq(prev, onlyChatMessages(data.entries)))
        setError(false)
        loadedOnceRef.current = true
      } catch {
        if (signal.aborted) return
        // 已经有数据时静默失败，不要把已渲染的聊天替换成错误页
        if (!loadedOnceRef.current) setError(true)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }
  })

  return { entries, loading, error, refresh, loadMore, hasMore, polling, setPolling }
}
