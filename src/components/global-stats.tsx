'use client'

import { useMemo } from 'react'
import { BarChart3, Terminal } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useGlobalStats } from '@/hooks/use-global-stats'
import { formatCompact, formatServerTime } from '@/lib/format'
import { resourceName, MAIN_RESOURCE_IDS } from '@/lib/game-data'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

/* 数值行：iOS inset grouped 里的一行——标签在左、值在右，行间 0.5px 缩进分隔线 */
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div data-list-item className="flex items-baseline justify-between gap-4 px-4 py-2">
      <dt className="shrink-0 text-body-02 text-on-surface-medium">{label}</dt>
      <dd className="text-body-02 font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

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

  const heading = (
    <div className="mb-2 flex items-center justify-between gap-3 px-4">
      <h2 className="flex items-center gap-2 text-label font-semibold text-on-surface-medium">
        <BarChart3 className="h-4 w-4" />
        {t.globalTitle}
      </h2>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
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
    </div>
  )

  if (loading) {
    return (
      <section>
        {heading}
        <div className="grid gap-2 rounded-sm bg-surface-02 p-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </section>
    )
  }

  if (error || !ps) {
    return (
      <section>
        {heading}
        <p className="rounded-sm bg-surface-02 px-4 py-8 text-center text-body-02 text-error">
          {t.error}
        </p>
      </section>
    )
  }

  const statLabels = t.globalLabels as Record<string, string>

  return (
    <section>
      {heading}

      {/* iOS 的每个分组各是一块：小标题在容器外，容器自带圆角与分隔线 */}
      <div className="space-y-6">
        {GROUPS.map((group) => {
          const rows = group.keys
            .map((k) => ({ key: k, value: ps[k] }))
            .filter((r) => typeof r.value === 'number')
          if (rows.length === 0) return null
          return (
            <div key={group.id}>
              <h3 className="mb-1 px-4 text-label font-semibold text-on-surface-medium">
                {statLabels[group.id] ?? group.id}
              </h3>
              <dl data-list-group className="overflow-hidden rounded-sm bg-surface-02">
                {rows.map((row) => (
                  <StatRow
                    key={row.key}
                    label={statLabels[row.key] ?? row.key}
                    value={(row.value as number).toLocaleString()}
                  />
                ))}
              </dl>
            </div>
          )
        })}

        {loot.length > 0 && (
          <div>
            <h3 className="mb-1 px-4 text-label font-semibold text-on-surface-medium">
              {t.globalLoot}
            </h3>
            <dl data-list-group className="overflow-hidden rounded-sm bg-surface-02">
              {loot.map((r) => (
                <StatRow key={r.id} label={r.name} value={formatCompact(r.value, locale)} />
              ))}
            </dl>
          </div>
        )}

        {topCommands.length > 0 && (
          <div>
            <h3 className="mb-1 flex items-center gap-1.5 px-4 text-label font-semibold text-on-surface-medium">
              <Terminal className="h-3.5 w-3.5" />
              {t.globalTopCommands}
            </h3>
            <ul data-list-group className="overflow-hidden rounded-sm bg-surface-02">
              {topCommands.map((cmd, i) => {
                const max = topCommands[0].count || 1
                return (
                  <li key={cmd.name} data-list-item className="flex items-center gap-3 px-4 py-2">
                    <span className="w-5 shrink-0 text-label text-on-surface-medium tabular-nums">
                      {i + 1}
                    </span>
                    <code className="w-32 shrink-0 truncate font-mono text-label">/{cmd.name}</code>
                    <Progress
                      value={(cmd.count / max) * 100}
                      aria-label={`/${cmd.name}`}
                      className="flex-1"
                    />
                    <span className="w-16 shrink-0 text-right text-label tabular-nums text-on-surface-medium">
                      {cmd.count.toLocaleString()}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
