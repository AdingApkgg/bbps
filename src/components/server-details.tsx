'use client'

import { Server } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import { formatBytes, formatDuration, formatServerTime, parseUptimeSeconds } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function ServerDetails() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.stats
  const { stats, loading, error } = useServerStats()

  const rows: { label: string; value: string }[] = stats
    ? [
        {
          label: t.detailUptime,
          value: (() => {
            const secs = parseUptimeSeconds(stats.server_uptime)
            return secs == null ? '—' : formatDuration(secs, locale)
          })()
        },
        {
          label: t.detailMemory,
          value: stats.memory_used != null ? formatBytes(stats.memory_used) : '—'
        },
        {
          label: t.detailConnections,
          value: (stats.online_connections ?? 0).toLocaleString()
        },
        {
          label: t.detailCachedAccounts,
          value: (stats.cached_accounts ?? 0).toLocaleString()
        },
        {
          label: t.detailMsgIn,
          value: (stats.incoming_message_count ?? 0).toLocaleString()
        },
        {
          label: t.detailMsgOut,
          value: (stats.outgoing_message_count ?? 0).toLocaleString()
        },
        {
          label: t.detailSaveMode,
          value: String(stats.save_mode ?? '—')
        },
        {
          label: t.detailSaveFailures,
          value: (stats.account_save_failures ?? 0).toLocaleString()
        },
        {
          label: t.detailPatch,
          value: stats.use_patch
            ? `${t.detailPatchOn}${stats.patch_sha ? ` · ${String(stats.patch_sha)}` : ''}`
            : t.detailPatchOff
        },
        {
          label: t.detailServerTime,
          value: stats.datetime_utcnow
            ? formatServerTime(String(stats.datetime_utcnow), locale)
            : '—'
        }
      ]
    : []

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-3 px-4">
        <h2 className="flex items-center gap-2 text-label font-semibold text-on-surface-medium">
          <Server className="h-4 w-4" />
          {t.detailsTitle}
        </h2>
        {stats?.game_server_address && (
          <Badge variant="outline" className="font-mono text-label">
            {String(stats.game_server_address)}
          </Badge>
        )}
      </div>

      <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
        {loading && (
          <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="px-4 py-6 text-center text-body-02 text-error">{t.error}</p>
        )}

        {!loading && !error && stats && (
          <dl>
            {rows.map((row) => (
              <div
                key={row.label}
                data-list-item
                className="flex items-baseline justify-between gap-4 px-4 py-2"
              >
                <dt className="shrink-0 text-body-02 text-on-surface-medium">{row.label}</dt>
                <dd className="truncate text-body-02 font-semibold tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
