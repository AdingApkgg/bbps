'use client'

import { Users, Trophy, Video } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'

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

  const statCards = [
    {
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      label: dict.stats.onlinePlayers,
      value: onlinePlayers
    },
    {
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      label: dict.stats.totalPlayers,
      value: totalPlayers
    },
    {
      icon: <Video className="h-4 w-4 text-muted-foreground" />,
      label: dict.stats.totalReplays,
      value: totalReplays
    }
  ]

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {dict.stats.onlinePlayers}
        </h1>
      </FadeIn>

      {/* Stat cards */}
      <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <StaggerItem key={stat.label}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stat.value.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Online players list */}
      <FadeIn delay={0.3}>
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">
              {dict.stats.onlinePlayers}
            </CardTitle>
            <Badge variant="secondary">{players.length}</Badge>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-3">
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
              <p className="py-8 text-center text-sm text-destructive">
                {dict.stats.error}
              </p>
            )}

            {!loading && !error && players.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {dict.stats.noPlayers}
              </p>
            )}

            {!loading && players.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>
                        {locale === 'zh' ? '玩家' : 'Player'}
                      </TableHead>
                      <TableHead className="text-right">ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player, index) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {player.id}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  )
}
