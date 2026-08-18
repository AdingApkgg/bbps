'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { ApiError, fetchPlayerBase, type PlayerBase } from '@/lib/api'
import { buildingName, HQ_BUILDING_ID } from '@/lib/game-data'
import { PlayerName } from '@/components/player-name'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

/**
 * 这组接口按 IP 限速 60 次/分钟，所以：
 * 只在用户点击时请求，且同一玩家的结果缓存起来，重复打开不再发请求。
 */
const cache = new Map<number, PlayerBase>()

export interface PlayerBaseTarget {
  id: number
  name: string
}

export function PlayerBaseSheet({
  target,
  onOpenChange
}: {
  target: PlayerBaseTarget | null
  onOpenChange: (open: boolean) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).stats
  const [entry, setEntry] = useState<{
    id: number
    data?: PlayerBase
    error?: 'rate' | 'other'
  } | null>(null)

  // 命中缓存时直接同步取用，不发请求（该接口每分钟限 60 次）
  const cached = target ? (cache.get(target.id) ?? null) : null
  const current = target && entry?.id === target.id ? entry : null
  const data = cached ?? current?.data ?? null
  const errorKind = current?.error ?? null
  const loading = !!target && !data && !errorKind

  useEffect(() => {
    if (!target || cache.has(target.id)) return

    let cancelled = false
    const controller = new AbortController()

    const run = async () => {
      try {
        const result = await fetchPlayerBase(target.id, controller.signal)
        if (cancelled) return
        cache.set(target.id, result)
        setEntry({ id: target.id, data: result })
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) return
        setEntry({
          id: target.id,
          error:
            e instanceof ApiError && e.kind === 'rate_limited' ? 'rate' : 'other'
        })
      }
    }
    run()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [target])

  const summary = useMemo(() => {
    if (!data) return null
    const buildings = data.home?.buildings ?? []
    const hq = buildings.find((b) => b.data === HQ_BUILDING_ID)

    const byType = new Map<number, { count: number; maxLvl: number }>()
    for (const b of buildings) {
      const cur = byType.get(b.data) ?? { count: 0, maxLvl: 0 }
      cur.count += 1
      cur.maxLvl = Math.max(cur.maxLvl, b.lvl ?? 0)
      byType.set(b.data, cur)
    }
    const top = [...byType.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.count - a.count || b.maxLvl - a.maxLvl)
      .slice(0, 12)

    const regions = data.map?.MapRegions ?? []
    return {
      hqLevel: hq?.lvl ?? null,
      buildingCount: buildings.length,
      trapCount: data.home?.traps?.length ?? 0,
      obstacleCount: data.home?.obstacles?.length ?? 0,
      decoCount: data.home?.decos?.length ?? 0,
      seasonName: data.home?.season?.name ?? null,
      outposts: data.map?.Outposts?.length ?? 0,
      exploredRegions: regions.filter((r) => r?.Explored).length,
      totalRegions: regions.length,
      explorationCounter: data.map?.ExplorationCounter ?? 0,
      top
    }
  }, [data])

  return (
    <Sheet open={!!target} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="pr-6">
            {target ? <PlayerName name={target.name} /> : ''}
          </SheetTitle>
          <SheetDescription>{t.baseSheetDesc}</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.loading}
            </div>
          )}

          {!loading && errorKind && (
            <p className="py-12 text-center text-sm text-destructive">
              {errorKind === 'rate' ? t.baseRateLimited : t.baseError}
            </p>
          )}

          {!loading && !errorKind && summary && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {summary.hqLevel != null && (
                  <Badge>
                    {t.baseHq} {summary.hqLevel}
                  </Badge>
                )}
                {summary.seasonName && (
                  <Badge variant="secondary">{summary.seasonName}</Badge>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-x-6">
                {[
                  { label: t.baseBuildings, value: summary.buildingCount },
                  { label: t.baseTraps, value: summary.trapCount },
                  { label: t.baseObstacles, value: summary.obstacleCount },
                  { label: t.baseDecos, value: summary.decoCount },
                  { label: t.baseOutposts, value: summary.outposts },
                  {
                    label: t.baseExplored,
                    value: `${summary.exploredRegions}/${summary.totalRegions}`
                  }
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-3 border-b py-2"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-medium tabular-nums">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {summary.top.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    {t.baseComposition}
                  </h3>
                  <ul className="space-y-1">
                    {summary.top.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-baseline justify-between gap-3 border-b py-1.5 text-sm"
                      >
                        <span className="truncate text-muted-foreground">
                          {buildingName(b.id)}
                        </span>
                        <span className="shrink-0 tabular-nums">
                          ×{b.count}
                          <span className="ml-2 text-xs text-muted-foreground">
                            Lv.{b.maxLvl}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
