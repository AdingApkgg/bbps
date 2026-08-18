'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquare, RefreshCw } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useChat } from '@/hooks/use-chat'
import { PlayerName } from '@/components/player-name'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

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

export function ChatFeed() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const { entries, loading, error, refresh } = useChat()
  const [refreshing, setRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pinnedToBottomRef = useRef(true)

  // 接口返回时间正序（最老在前），聊天界面倒序展示更符合直觉：最新的在最上面
  const newestFirst = useMemo(() => [...entries].reverse(), [entries])

  // 新消息进来时，若用户没有主动向下翻，保持贴在顶部（最新处）
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
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{dict.stats.chatTitle}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {!loading && !error && (
            <Badge variant="secondary">{entries.length}</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            aria-label={dict.stats.chatRefresh}
            title={dict.stats.chatRefresh}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">
          {dict.stats.chatHint}
        </p>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-24 shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="py-8 text-center text-sm text-destructive">
            {dict.stats.chatError}
          </p>
        )}

        {!loading && !error && newestFirst.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {dict.stats.chatEmpty}
          </p>
        )}

        {!loading && newestFirst.length > 0 && (
          <div
            ref={scrollRef}
            onScroll={(e) => {
              pinnedToBottomRef.current = e.currentTarget.scrollTop < 24
            }}
            className="max-h-[460px] space-y-3 overflow-y-auto rounded-md border p-3"
          >
            {newestFirst.map((entry) => (
              <div key={entry.seq} className="text-sm">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <PlayerName
                    name={entry.sender_name}
                    className="font-medium break-all"
                  />
                  <span className="text-xs text-muted-foreground">
                    Lv.{entry.sender_level}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                    {formatTime(entry.time, locale)}
                  </span>
                </div>
                <p className="mt-0.5 break-words text-muted-foreground">
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
