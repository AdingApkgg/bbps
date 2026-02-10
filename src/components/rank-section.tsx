'use client'

import { Trophy, Shell, Skull } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useRank } from '@/hooks/use-rank'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
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
import { parseGameText, type RankEntry } from '@/lib/rank'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/motion'

function RankTable({
  list,
  colRank,
  colLevel,
  colPlayer,
  scoreLabel,
  noData,
  loading
}: {
  list: RankEntry[]
  colRank: string
  colLevel: string
  colPlayer: string
  scoreLabel: string
  noData: string
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-3 py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!list.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {noData}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{colRank}</TableHead>
            <TableHead className="w-16">{colLevel}</TableHead>
            <TableHead>{colPlayer}</TableHead>
            <TableHead className="text-right">{scoreLabel}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((entry, i) => {
            const nameHtml = parseGameText(entry.rawName || entry.name)
            return (
              <TableRow key={`${entry.rank}-${entry.name}-${i}`}>
                <TableCell>
                  {entry.rank <= 3 ? (
                    <Badge
                      variant={entry.rank === 1 ? 'default' : 'secondary'}
                      className={cn(
                        'justify-center tabular-nums',
                        entry.rank === 1 && 'bg-yellow-500 text-yellow-950 hover:bg-yellow-500/80'
                      )}
                    >
                      #{entry.rank}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {entry.level || '—'}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {nameHtml ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: nameHtml }}
                      title={entry.name}
                    />
                  ) : (
                    <span title={entry.name}>{entry.name || '—'}</span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {Number(entry.value).toLocaleString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export function RankSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const r = dict.rank
  const { data, loading, error } = useRank()

  const vpList = data?.vp ?? []
  const megacrabList = data?.megacrab ?? []
  const casualtiesList = data?.casualties ?? []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{r.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{r.subtitle}</p>
      </FadeIn>

      {error && (
        <p className="mt-4 text-center text-sm text-destructive">{r.error}</p>
      )}

      <Card className="mt-10">
        <CardContent className="p-6">
          <Tabs defaultValue="vp" className="w-full">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="vp" className="flex-1 gap-1.5">
                <Trophy className="h-4 w-4" />
                {r.tabVp}
              </TabsTrigger>
              <TabsTrigger value="megacrab" className="flex-1 gap-1.5">
                <Shell className="h-4 w-4" />
                {r.tabMegaCrab}
              </TabsTrigger>
              <TabsTrigger value="casualties" className="flex-1 gap-1.5">
                <Skull className="h-4 w-4" />
                {r.tabCasualties}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="vp">
              <RankTable
                list={vpList}
                colRank={r.colRank}
                colLevel={r.colLevel}
                colPlayer={r.colPlayer}
                scoreLabel={r.scoreLabelVp}
                noData={r.noData}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="megacrab">
              <RankTable
                list={megacrabList}
                colRank={r.colRank}
                colLevel={r.colLevel}
                colPlayer={r.colPlayer}
                scoreLabel={r.scoreLabelCrab}
                noData={r.noData}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="casualties">
              <RankTable
                list={casualtiesList}
                colRank={r.colRank}
                colLevel={r.colLevel}
                colPlayer={r.colPlayer}
                scoreLabel={r.scoreLabelCasualties}
                noData={r.noData}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
