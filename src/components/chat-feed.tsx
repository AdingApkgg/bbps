'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquare, RefreshCw } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useChat } from '@/hooks/use-chat'
import { PlayerName } from '@/components/player-name'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressIndeterminate } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

/** time 是 Unix 秒，转 Date 要 × 1000 */
function formatTime(unixSeconds: number, locale: string): string {
  const d = new Date(unixSeconds * 1000)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/* 最近聊天
 *
 * HIG 版式：分组抬头在容器外，标题栏右侧是控件（自动刷新开关、刷新按钮）。
 * 消息不是卡片，是带缩进分隔线的行；发送者加粗、时间退到行尾次要色，
 * 消息正文作为第二行。滚动区贴边，分隔线跟着行一起滚。
 */
export function ChatFeed() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const { entries, loading, error, refresh, loadMore, hasMore, polling, setPolling } = useChat()
  const [refreshing, setRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pinnedToBottomRef = useRef(true)

  // 接口返回时间正序（最老在前），聊天界面倒序展示更符合直觉：最新的在最上面
  const newestFirst = useMemo(() => [...entries].reverse(), [entries])

  // 新消息进来时，若用户没有主动向下翻，保持贴在顶部（最新处）
  // biome-ignore lint/correctness/useExhaustiveDependencies: 该依赖是触发器而非函数体读取的值，删掉会让 effect 只在挂载时跑一次
  useEffect(() => {
    const el = scrollRef.current
    if (el && pinnedToBottomRef.current) el.scrollTop = 0
  }, [newestFirst.length])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refresh()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3 px-4">
        <h2 className="flex items-center gap-2 text-label font-semibold text-on-surface-medium">
          <MessageSquare className="h-4 w-4" />
          {dict.stats.chatTitle}
        </h2>
        <div className="flex items-center gap-3">
          <label
            htmlFor="chat-auto-refresh"
            className="flex items-center gap-2 text-label text-on-surface-medium"
          >
            <Switch id="chat-auto-refresh" checked={polling} onCheckedChange={setPolling} />
            <span className="hidden sm:inline">{dict.stats.chatAutoRefresh}</span>
          </label>
          {!loading && !error && <Badge variant="secondary">{entries.length}</Badge>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            aria-label={dict.stats.chatRefresh}
            title={dict.stats.chatRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 一块容器当组：状态（加载/错误/空）与列表共用同一块底，不套两层 */}
      <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
        {(loading || refreshing) && <ProgressIndeterminate />}

        <p className="px-4 py-2 text-label text-on-surface-medium">{dict.stats.chatHint}</p>

        {loading && (
          <div className="space-y-3 px-4 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-24 shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="px-4 py-8 text-center text-body-02 text-error">{dict.stats.chatError}</p>
        )}

        {!loading && !error && newestFirst.length === 0 && (
          <p className="px-4 py-8 text-center text-body-02 text-on-surface-medium">
            {dict.stats.chatEmpty}
          </p>
        )}

        {!loading && newestFirst.length > 0 && (
          <div
            ref={scrollRef}
            onScroll={(e) => {
              pinnedToBottomRef.current = e.currentTarget.scrollTop < 24
              /* 快滚到底就补一段 —— 接口不支持游标，只能扩窗口重取 */
              const el = e.currentTarget
              if (hasMore && el.scrollHeight - el.scrollTop - el.clientHeight < 200) loadMore()
            }}
            className="max-h-[460px] overflow-y-auto"
          >
            <ul>
              {newestFirst.map((entry) => (
                <li key={entry.seq} data-list-item className="px-4 py-2.5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-body-02">
                    <PlayerName name={entry.sender_name} className="font-semibold break-all" />
                    <span className="text-label text-on-surface-medium">
                      Lv.{entry.sender_level}
                    </span>
                    <span className="ml-auto shrink-0 text-label text-on-surface-medium tabular-nums">
                      {formatTime(entry.time, locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 break-words text-body-02 text-on-surface-medium">
                    {entry.message}
                  </p>
                </li>
              ))}
            </ul>
            {hasMore && (
              <p className="px-4 py-2 text-center text-label text-on-surface-medium">
                {dict.stats.chatMore}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
