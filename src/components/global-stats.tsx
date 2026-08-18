'use client'

import { useMemo } from 'react'
import { BarChart3, Terminal } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useGlobalStats } from '@/hooks/use-global-stats'
import { formatCompact, formatServerTime } from '@/lib/format'
import { resourceName, MAIN_RESOURCE_IDS } from '@/lib/game-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

/** 只展示有意义的汇总项 —— 709 个字段里绝大多数是带 ID 后缀的明细，堆出来是噪音 */
const GROUPS: { id: string; keys: string[] }[] = [
  {
    id: 'battle',
    keys: [
      'player_attack',
      'player_attack_win',
      'npc_attack_win',
      'npc_boss_attack_win',
      'character_deploy',
      'spell_use',
      'hero_ability_use'
    ]
  },
  {
    id: 'build',
    keys: ['building_upgrade', 'building_buy', 'unit_upgrade', 'obstacle_clear']
  },
  {
    id: 'social',
    keys: [
      'chat',
      'player_visit',
      'replay_watch',
      'warship_attack',
      'coop_score_accumulated',
      'game_join'
    ]
  }
]

export function GlobalStats() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.stats
  const { data, loading, error } = useGlobalStats()

  const ps = data?.PlayerStatistics

  /** hbcmd_run_xxx → 最常用指令排行 */
  const topCommands = useMemo(() => {
    if (!ps) return []
    return Object.entries(ps)
      .filter(([k, v]) => k.startsWith('hbcmd_run_') && k.length > 10 && v > 0)
      .map(([k, v]) => ({ name: k.slice('hbcmd_run_'.length), count: v }))
      .filter((c) => c.name && !/^\d+$/.test(c.name))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
  }, [ps])

  const loot = useMemo(() => {
    if (!ps) return []
    return MAIN_RESOURCE_IDS.map((id) => ({
      id,
      name: resourceName(id, locale) ?? `#${id}`,
      value: ps[`resource_loot_${id}`] ?? 0
    })).filter((r) => r.value > 0)
  }, [ps, locale])

  /** 最近一次开服时间 */
  const lastOpen = useMemo(() => {
    const list = data?.ServerOpenTime
    return Array.isArray(list) && list.length ? list[list.length - 1] : null
  }, [data])

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">{t.globalTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error || !ps) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">{t.globalTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-destructive">{t.error}</p>
        </CardContent>
      </Card>
    )
  }

  const statLabels = t.globalLabels as Record<string, string>

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{t.globalTitle}</CardTitle>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge variant="outline">
            {t.globalRestarts}
            {': '}
            {data?.ServerOpenTime?.length ?? 0}
          </Badge>
          {lastOpen && (
            <Badge variant="secondary" className="whitespace-nowrap">
              {t.globalLastOpen}
              {': '}
              {formatServerTime(lastOpen, locale)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {GROUPS.map((group) => {
          const rows = group.keys
            .map((k) => ({ key: k, value: ps[k] }))
            .filter((r) => typeof r.value === 'number')
          if (rows.length === 0) return null
          return (
            <div key={group.id}>
              <h3 className="mb-2 text-sm font-semibold">
                {statLabels[group.id] ?? group.id}
              </h3>
              <dl className="grid gap-x-6 gap-y-0 sm:grid-cols-2">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
                  >
                    <dt className="shrink-0 text-sm text-muted-foreground">
                      {statLabels[row.key] ?? row.key}
                    </dt>
                    <dd className="text-sm font-medium tabular-nums">
                      {row.value.toLocaleString()}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}

        {loot.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t.globalLoot}</h3>
            <dl className="grid gap-x-6 gap-y-0 sm:grid-cols-2">
              {loot.map((r) => (
                <div
                  key={r.id}
                  className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
                >
                  <dt className="shrink-0 text-sm text-muted-foreground">
                    {r.name}
                  </dt>
                  <dd className="text-sm font-medium tabular-nums">
                    {formatCompact(r.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {topCommands.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Terminal className="h-3.5 w-3.5" />
              {t.globalTopCommands}
            </h3>
            <ul className="space-y-1.5">
              {topCommands.map((cmd, i) => {
                const max = topCommands[0].count || 1
                return (
                  <li key={cmd.name} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-xs text-muted-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <code className="w-32 shrink-0 truncate font-mono text-xs">
                      /{cmd.name}
                    </code>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${(cmd.count / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {cmd.count.toLocaleString()}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
