'use client'

import { Server } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import {
  formatBytes,
  formatDuration,
  formatServerTime,
  parseUptimeSeconds
} from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
          value:
            stats.memory_used != null ? formatBytes(stats.memory_used) : '—'
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
            ? `${t.detailPatchOn}${
                stats.patch_sha ? ` · ${String(stats.patch_sha)}` : ''
              }`
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
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">{t.detailsTitle}</CardTitle>
        </div>
        {stats?.game_server_address && (
          <Badge variant="outline" className="font-mono text-xs">
            {String(stats.game_server_address)}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="py-6 text-center text-sm text-destructive">{t.error}</p>
        )}

        {!loading && !error && stats && (
          <dl className="grid gap-x-6 gap-y-0 sm:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
              >
                <dt className="shrink-0 text-sm text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="truncate text-sm font-medium tabular-nums">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
