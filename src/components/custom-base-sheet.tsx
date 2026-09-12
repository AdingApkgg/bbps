'use client'

import { Download, Lock, KeyRound } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { customBaseDownloadUrl, type CustomBase } from '@/lib/api'
import { baseLevelLabel } from '@/lib/custom-bases'
import { formatBytes, formatServerTime } from '@/lib/format'
import { PlayerName } from '@/components/player-name'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

/**
 * 基地详情。
 *
 * 不发任何请求 —— /api/bases/{name} 返回的对象和列表项键集取值完全一致，
 * 列表里已经有了，再拉一次只是白白消耗 60 次/分钟的限速额度。
 */
export function CustomBaseSheet({
  base,
  onOpenChange
}: {
  base: CustomBase | null
  onOpenChange: (open: boolean) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).maps

  const rows = base
    ? [
        {
          label: t.colType,
          value: baseLevelLabel(base.base_level, locale, t.uncategorized)
        },
        { label: t.colBuildings, value: base.building_count.toLocaleString() },
        { label: t.colTraps, value: base.trap_count.toLocaleString() },
        { label: t.colSize, value: formatBytes(base.byte_size) },
        {
          label: t.downloadCount,
          value: base.download_count.toLocaleString()
        },
        {
          label: t.artifactType,
          value: base.artifact_type == null ? '—' : String(base.artifact_type)
        },
        { label: t.created, value: formatServerTime(base.created_at, locale) },
        { label: t.colUpdated, value: formatServerTime(base.updated_at, locale) }
      ]
    : []

  return (
    <Sheet open={!!base} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="pr-6 break-all">{base?.name ?? ''}</SheetTitle>
          <SheetDescription>
            {base?.owner_name ? (
              <span className="inline-flex items-center gap-1">
                {t.owner}
                <PlayerName name={base.owner_name} />
              </span>
            ) : (
              t.unowned
            )}
          </SheetDescription>
        </SheetHeader>

        {base && (
          <div className="space-y-6 px-4 pb-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant={base.locked ? 'secondary' : 'default'}>
                {base.locked ? <Lock className="mr-1 h-3 w-3" /> : null}
                {base.locked ? t.locked : t.editable}
              </Badge>
              {base.has_password && (
                <Badge variant="outline">
                  <KeyRound className="mr-1 h-3 w-3" />
                  {t.hasPassword}
                </Badge>
              )}
            </div>

            <dl>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b py-2"
                >
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="text-sm font-medium tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-2">
              {/*
                用 <a> 而不是 fetch：导航请求不走 CORS，服务端
                Content-Disposition 里的 UTF-8 文件名直接生效。
              */}
              <Button asChild className="w-full">
                <a href={customBaseDownloadUrl(base.name)}>
                  <Download className="mr-2 h-4 w-4" />
                  {t.download}
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">{t.downloadHint}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
