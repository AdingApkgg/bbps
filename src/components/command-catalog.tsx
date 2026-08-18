'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Play,
  Search,
  ShieldAlert,
  X
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import {
  COMMANDS_BY_GROUP,
  LAYOUT_VALUES,
  paramHint,
  searchCatalog,
  type CatalogCommand
} from '@/lib/commands'
import { fillTemplate, isTemplateReady, parseTemplate } from '@/lib/command-template'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/* ── 单条指令 ── */

function CatalogItem({
  item,
  canRun,
  onRun
}: {
  item: CatalogCommand
  canRun: boolean
  onRun: (command: string) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(0)

  const params = useMemo(
    () => parseTemplate(item.syntax).filter((p) => p.type === 'param'),
    [item.syntax]
  )
  const final = fillTemplate(item.syntax, values)
  const ready = isTemplateReady(item.syntax, values)
  // ☢ 要点两次，⚠ 点一次
  const confirmsNeeded =
    item.danger === 'destructive' ? 2 : item.danger === 'warn' ? 1 : 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(final)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用 */
    }
  }

  const handleRun = () => {
    if (confirming < confirmsNeeded) {
      setConfirming((n) => n + 1)
      setTimeout(() => setConfirming(0), 4000)
      return
    }
    setConfirming(0)
    onRun(final)
  }

  const runLabel =
    confirmsNeeded === 0 || confirming >= confirmsNeeded
      ? t.runButton
      : item.danger === 'destructive' && confirming === 0
        ? t.confirmDestructive
        : t.confirmOnce

  return (
    <li
      className={cn(
        'rounded-lg border p-3',
        item.danger === 'destructive' && 'border-destructive/40',
        item.danger === 'warn' && 'border-amber-500/40'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <code className="break-all font-mono text-sm font-medium">
              {item.syntax}
            </code>
            {item.danger === 'destructive' && (
              <Badge variant="destructive" className="gap-1 text-[10px]">
                <ShieldAlert className="h-3 w-3" />
                {t.dangerDestructive}
              </Badge>
            )}
            {item.danger === 'warn' && (
              <Badge variant="outline" className="gap-1 border-amber-500/50 text-[10px]">
                <AlertTriangle className="h-3 w-3" />
                {t.dangerWarn}
              </Badge>
            )}
            {item.queryOnly && (
              <Badge variant="secondary" className="text-[10px]">{t.queryOnly}</Badge>
            )}
            {item.needsHome && (
              <Badge variant="secondary" className="text-[10px]">{t.needsHome}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          {item.aliases.length > 0 && (
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span>{t.aliases}</span>
              {item.aliases.map((a) => (
                <code key={a} className="rounded bg-muted px-1 font-mono">{a}</code>
              ))}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-1.5">
          <Button variant="outline" size="sm" onClick={handleCopy} aria-label={t.copyButton}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          {!item.inGameOnly && !item.advancedOnly && (
            <Button
              size="sm"
              variant={confirming > 0 ? 'destructive' : 'default'}
              onClick={handleRun}
              disabled={!canRun || !ready}
              title={!canRun ? t.runNeedsLogin : undefined}
            >
              <Play className="mr-1 h-3.5 w-3.5" />
              {runLabel}
            </Button>
          )}
        </div>
      </div>

      {item.inGameOnly && (
        <p className="mt-2 rounded-md bg-muted px-2 py-1.5 text-xs text-muted-foreground">
          {t.inGameOnly}
        </p>
      )}
      {item.advancedOnly && (
        <p className="mt-2 rounded-md bg-muted px-2 py-1.5 text-xs text-muted-foreground">
          {t.advancedOnlyHint}
        </p>
      )}

      {/* 带参数的指令：展开小表单，而不是直接发一条缺参数的指令 */}
      {params.length > 0 && !item.inGameOnly && !item.advancedOnly && (
        <div className="mt-2 space-y-1.5">
          {params.map((p) => {
            const hint = paramHint(p.value, locale)
            const isLayout = p.value.toLowerCase().includes('layout')
            return (
              <div key={p.value} className="flex flex-wrap items-center gap-2">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                  {p.value}
                  {p.optional && <span className="ml-0.5 opacity-60">({t.optional})</span>}
                </span>
                {isLayout ? (
                  <select
                    value={values[p.value] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [p.value]: e.target.value }))
                    }
                    className="h-7 rounded-md border bg-background px-2 text-xs"
                  >
                    <option value="">—</option>
                    {LAYOUT_VALUES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={values[p.value] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [p.value]: e.target.value }))
                    }
                    placeholder={p.value}
                    className="h-7 w-40 text-xs"
                  />
                )}
                {hint && (
                  <span className="w-full text-[11px] leading-snug text-muted-foreground sm:w-auto sm:flex-1">
                    {hint}
                  </span>
                )}
              </div>
            )
          })}
          <code className="block break-all rounded bg-muted px-2 py-1 font-mono text-xs">
            {final}
          </code>
        </div>
      )}
    </li>
  )
}

/* ── 目录 ── */

export function CommandCatalog({
  canRun,
  onRun
}: {
  canRun: boolean
  onRun: (command: string) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const matched = useMemo(() => new Set(searchCatalog(query)), [query])
  const searching = query.trim().length > 0

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.catalogSearch}
          className="pl-9 pr-9"
          aria-label={t.catalogSearch}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={t.clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {COMMANDS_BY_GROUP.map(({ meta, items }) => {
        const visible = items.filter((i) => matched.has(i))
        if (visible.length === 0) return null
        // 搜索时一律展开，否则按默认折叠状态
        const expanded = searching || (open[meta.id] ?? !meta.collapsed)

        return (
          <Card key={meta.id}>
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() => setOpen((o) => ({ ...o, [meta.id]: !expanded }))}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {locale === 'en' ? meta.labelEn : meta.labelZh}
                    <Badge variant="secondary" className="text-[10px]">
                      {visible.length}
                    </Badge>
                  </CardTitle>
                  {(meta.noteZh || meta.noteEn) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {locale === 'en' ? meta.noteEn : meta.noteZh}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    expanded && 'rotate-180'
                  )}
                />
              </div>
            </CardHeader>
            {expanded && (
              <CardContent>
                <ul className="space-y-2">
                  {visible.map((item) => (
                    <CatalogItem
                      key={item.cmd}
                      item={item}
                      canRun={canRun}
                      onRun={onRun}
                    />
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        )
      })}

      {matched.size === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t.noResults}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
