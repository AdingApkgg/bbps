'use client'

import { Users, Trophy, Video } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ServerStats() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const {
    onlinePlayers,
    totalPlayers,
    totalReplays,
    players,
    loading,
    error
  } = useServerStats()

  return (
    <section className="container max-w-7xl space-y-8 px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <h2 className="text-2xl font-semibold md:text-3xl">
          {dict.stats.onlinePlayers}
        </h2>
        <Badge
          variant="secondary"
          className={cn(
            'gap-1.5',
            (onlinePlayers ?? 0) > 0 && 'animate-pulse'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          LIVE
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  'text-2xl font-bold',
                  loading && 'animate-pulse'
                )}
              >
                {loading ? '...' : onlinePlayers}
              </span>
              <span className="text-sm text-muted-foreground">
                {dict.stats.onlinePlayers}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Trophy className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  'text-2xl font-bold',
                  loading && 'animate-pulse'
                )}
              >
                {loading ? '...' : totalPlayers}
              </span>
              <span className="text-sm text-muted-foreground">
                {dict.stats.totalPlayers}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Video className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  'text-2xl font-bold',
                  loading && 'animate-pulse'
                )}
              >
                {loading ? '...' : totalReplays}
              </span>
              <span className="text-sm text-muted-foreground">
                {dict.stats.totalReplays}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="flex-1 font-medium">{dict.stats.onlinePlayers}</span>
          <Badge variant="secondary">{players.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="max-h-[320px] overflow-y-auto rounded-md border">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
                {dict.stats.loading}
              </div>
            )}
            {!loading && error && (
              <div className="py-8 text-center text-destructive">
                {dict.stats.error}
              </div>
            )}
            {!loading && !error && players.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                {dict.stats.noPlayers}
              </div>
            )}
            {!loading &&
              players.length > 0 &&
              players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 border-b px-4 py-3 last:border-0"
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                      index < 3
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {player.id}
                    </p>
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
