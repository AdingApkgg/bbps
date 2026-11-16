'use client'

import { useState } from 'react'
import { Trophy, Shell, Skull, Swords } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useRank } from '@/hooks/use-rank'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow
} from '@/components/ui/table'
import type { RankEntry, LeaderboardScope } from '@/lib/rank'
import { PlayerName } from '@/components/player-name'
import { PlayerBaseSheet, type PlayerBaseTarget } from '@/components/player-base-sheet'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/motion'

function RankTable({
 list,
 colRank,
 colLevel,
 colPlayer,
 scoreLabel,
 noData,
 loading,
 onSelect
}: {
 list: RankEntry[]
 colRank: string
 colLevel: string
 colPlayer: string
 scoreLabel: string
 noData: string
 loading: boolean
 onSelect: (target: PlayerBaseTarget) => void
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
 return <p className="py-12 text-center text-body-02 text-on-surface-medium">{noData}</p>
 }

 return (
 <div className="overflow-x-auto rounded-sm bg-surface-01 shadow-sm">
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
 return (
 <TableRow key={`${entry.rank}-${entry.name}-${i}`}>
 <TableCell>
 {entry.rank <= 3 ? (
 <Badge
 variant={entry.rank === 1 ? 'default' : 'secondary'}
 className={cn(
 'justify-center tabular-nums',
 entry.rank === 1 && 'bg-warning text-on-warning'
 )}
 >
 #{entry.rank}
 </Badge>
 ) : (
 <span className="text-on-surface-medium">#{entry.rank}</span>
 )}
 </TableCell>
 <TableCell>
 <span className="text-body-02 text-on-surface-medium">{entry.level || '—'}</span>
 </TableCell>
 <TableCell className="max-w-[200px] truncate">
 {entry.playerId ? (
 <button
 type="button"
 onClick={() =>
 onSelect({
 id: entry.playerId as number,
 name: entry.rawName || entry.name
 })
 }
 className="truncate text-left hover:underline"
 >
 <PlayerName name={entry.rawName || entry.name} />
 </button>
 ) : (
 <PlayerName name={entry.rawName || entry.name} />
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
 const [scope, setScope] = useState<LeaderboardScope>('GLOBAL')
 const [target, setTarget] = useState<PlayerBaseTarget | null>(null)
 const { data, loading, error } = useRank(scope)

 const vpList = data?.vp ?? []
 const megacrabList = data?.megacrab ?? []
 const coeList = data?.coe ?? []
 const casualtiesList = data?.casualties ?? []

 const shared = {
 colRank: r.colRank,
 colLevel: r.colLevel,
 colPlayer: r.colPlayer,
 noData: r.noData,
 loading,
 onSelect: setTarget
 }

 const scopes: { id: LeaderboardScope; label: string }[] = [
 { id: 'GLOBAL', label: r.scopeGlobal },
 { id: 'LOCAL', label: r.scopeLocal }
 ]

 return (
 <div className="container-page max-w-4xl py-16 md:py-24" data-page="rank">
 <FadeIn eager className="text-center">
 <h1 className="text-headline-md font-normal">{r.title}</h1>
 <p className="mt-2 text-body-02 text-on-surface-medium">{r.subtitle}</p>
 </FadeIn>

 {error && <p className="mt-4 text-center text-body-02 text-error">{r.error}</p>}

 {/* 全球 / 本地切换。阵亡榜没有本地档，两边共用同一份数据 */}
 <div className="mt-8 flex justify-center" data-toolbar>
 <RadioGroup
 variant="segmented"
 value={scope}
 onValueChange={(v) => setScope(v as LeaderboardScope)}
 aria-label={r.title}
 className="inline-flex gap-0 rounded-sm bg-surface-variant-01 p-1"
 >
 {scopes.map((s) => (
 <RadioGroupItem key={s.id} value={s.id}>
 {s.label}
 </RadioGroupItem>
 ))}
 </RadioGroup>
 </div>

 <Card className="mt-6">
 <CardContent className="p-6">
 <Tabs defaultValue="vp" className="w-full">
 <TabsList className="mb-6 h-auto w-full flex-wrap">
 <TabsTrigger value="vp" className="flex-1 gap-1.5">
 <Trophy className="h-4 w-4" />
 {r.tabVp}
 </TabsTrigger>
 <TabsTrigger value="megacrab" className="flex-1 gap-1.5">
 <Shell className="h-4 w-4" />
 {r.tabMegaCrab}
 </TabsTrigger>
 <TabsTrigger value="coe" className="flex-1 gap-1.5">
 <Swords className="h-4 w-4" />
 {r.tabCoe}
 </TabsTrigger>
 <TabsTrigger value="casualties" className="flex-1 gap-1.5">
 <Skull className="h-4 w-4" />
 {r.tabCasualties}
 </TabsTrigger>
 </TabsList>

 <p className="mb-3 text-label text-on-surface-medium">{dict.stats.baseViewHint}</p>

 <TabsContent value="vp">
 <RankTable {...shared} list={vpList} scoreLabel={r.scoreLabelVp} />
 </TabsContent>
 <TabsContent value="megacrab">
 <RankTable {...shared} list={megacrabList} scoreLabel={r.scoreLabelCrab} />
 </TabsContent>
 <TabsContent value="coe">
 <RankTable {...shared} list={coeList} scoreLabel={r.colValue} />
 </TabsContent>
 <TabsContent value="casualties">
 <RankTable {...shared} list={casualtiesList} scoreLabel={r.scoreLabelCasualties} />
 </TabsContent>
 </Tabs>
 </CardContent>
 </Card>

 <PlayerBaseSheet
 target={target}
 onOpenChange={(open) => {
 if (!open) setTarget(null)
 }}
 />
 </div>
 )
}
