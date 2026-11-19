'use client'

import { useState } from 'react'
import { Users, Trophy, Video, Server } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeIn } from '@/components/motion'
import { PlayerName } from '@/components/player-name'
import { ChatFeed } from '@/components/chat-feed'
import { ServerDetails } from '@/components/server-details'
import { GlobalStats } from '@/components/global-stats'
import { PlayerBaseSheet, type PlayerBaseTarget } from '@/components/player-base-sheet'

/* 统计页
 *
 * HIG 版式：左对齐大标题，四项关键数值做成一排「指标」（数值大、标签小，
 * 铺在一块容器里、列间竖线分隔，不各占一张卡片），在线玩家是分组列表，
 * 行可点开基地。下面的聊天、详情、全服统计依次是同样结构的分组区段。
 */

/** 分组抬头：13px 次要色 */
function GroupTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 px-4">
      <h2 className="text-label font-semibold text-on-surface-medium">{children}</h2>
      {aside}
    </div>
  )
}

export function ServerStats() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [target, setTarget] = useState<PlayerBaseTarget | null>(null)
  const { serverVersion, onlinePlayers, totalPlayers, totalReplays, players, loading, error } =
    useServerStats()

  const metrics = [
    {
      icon: <Server className="h-3.5 w-3.5" />,
      label: locale === 'zh' ? '服务器版本' : 'Server Version',
      value: serverVersion || '-',
      raw: true
    },
    {
      icon: <Users className="h-3.5 w-3.5" />,
      label: dict.stats.onlinePlayers,
      value: onlinePlayers
    },
    {
      icon: <Trophy className="h-3.5 w-3.5" />,
      label: dict.stats.totalPlayers,
      value: totalPlayers
    },
    {
      icon: <Video className="h-3.5 w-3.5" />,
      label: dict.stats.totalReplays,
      value: totalReplays
    }
  ]

  return (
    <section className="container-page max-w-4xl pt-8 pb-16 md:pt-12 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{dict.stats.onlinePlayers}</h1>
        <p className="mt-1 text-headline-sm text-on-surface-medium">
          {locale === 'zh' ? '服务器实时状态' : 'Live server status'}
        </p>
      </FadeIn>

      {/* 关键数值：一块容器、四个等分列，列间竖线 */}
      <FadeIn delay={0.05} className="mt-6">
        <dl data-divider className="grid grid-cols-2 rounded-sm bg-surface-02 sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="px-4 py-3">
              <dt className="flex items-center gap-1.5 text-label text-on-surface-medium">
                {m.icon}
                {m.label}
              </dt>
              <dd className="mt-1 truncate text-title-lg font-semibold tabular-nums">
                {loading ? (
                  <Skeleton className="h-6 w-16" />
                ) : 'raw' in m && m.raw ? (
                  String(m.value)
                ) : (
                  Number(m.value).toLocaleString()
                )}
              </dd>
            </div>
          ))}
        </dl>
      </FadeIn>

      {/* 在线玩家 */}
      <FadeIn delay={0.1} className="mt-8">
        <GroupTitle aside={<Badge variant="secondary">{players.length}</Badge>}>
          {dict.stats.onlinePlayers}
        </GroupTitle>

        <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
          {loading && (
            <div className="space-y-3 px-4 py-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="px-4 py-8 text-center text-body-02 text-error">{dict.stats.error}</p>
          )}

          {!loading && !error && players.length === 0 && (
            <p className="px-4 py-8 text-center text-body-02 text-on-surface-medium">
              {dict.stats.noPlayers}
            </p>
          )}

          {!loading && players.length > 0 && (
            <>
              <p className="px-4 py-2 text-label text-on-surface-medium">
                {dict.stats.baseViewHint}
              </p>
              <ul className="max-h-[400px] overflow-y-auto">
                {players.map((player, index) => (
                  <li key={player.id} data-list-item>
                    <button
                      type="button"
                      onClick={() => setTarget({ id: player.id, name: player.name })}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-fast-02 hover:bg-surface-hover-01 active:bg-surface-pressed-01"
                    >
                      <span className="w-5 shrink-0 text-label text-on-surface-medium tabular-nums">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-body-02">
                        <PlayerName name={player.name} />
                      </span>
                      <span className="shrink-0 text-label text-on-surface-medium tabular-nums">
                        {player.id}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </FadeIn>

      {/* 最近聊天 */}
      <FadeIn delay={0.15} className="mt-10">
        <ChatFeed />
      </FadeIn>

      {/* 服务器详情：/api/server 里此前未展示的字段 */}
      <FadeIn delay={0.2} className="mt-10">
        <ServerDetails />
      </FadeIn>

      {/* 全服统计 */}
      <FadeIn delay={0.25} className="mt-10">
        <GlobalStats />
      </FadeIn>

      <PlayerBaseSheet
        target={target}
        onOpenChange={(open) => {
          if (!open) setTarget(null)
        }}
      />
    </section>
  )
}
