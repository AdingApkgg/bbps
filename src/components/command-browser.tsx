'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Play, Search, X } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { categories, commands, type Command } from '@/lib/commands-data'
import {
  fillTemplate,
  isRunnable,
  isTemplateReady,
  parseTemplate
} from '@/lib/command-template'
import { PlayerName } from '@/components/player-name'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/** 一次最多渲染这么多条，避免 1042 条全塞进 DOM */
const PAGE_SIZE = 40

/* ── 单条指令 ── */

function CommandItem({
  cmd,
  canRun,
  onRun
}: {
  cmd: Command
  canRun: boolean
  onRun: (command: string) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const parts = useMemo(() => parseTemplate(cmd.command), [cmd.command])
  const params = parts.filter((p) => p.type === 'param')
  const final = fillTemplate(cmd.command, values)
  const ready = isTemplateReady(cmd.command, values)
  const runnable = isRunnable(cmd.command)
  // 彩色字体那类条目本身就是 <cRRGGBB>文字</c>，直接预览成色
  const isColorSnippet = /^<c[0-9A-Fa-f]{6}>/.test(cmd.command)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(final)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用时静默 */
    }
  }

  return (
    <li className="rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{cmd.name}</p>
          <code className="mt-0.5 block break-all font-mono text-xs text-muted-foreground">
            {isColorSnippet ? (
              <PlayerName name={cmd.command} />
            ) : (
              final
            )}
          </code>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            aria-label={t.copyButton}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          {runnable && (
            <Button
              size="sm"
              onClick={() => onRun(final)}
              disabled={!canRun || !ready}
              title={!canRun ? t.runNeedsLogin : undefined}
            >
              <Play className="mr-1 h-3.5 w-3.5" />
              {t.runButton}
            </Button>
          )}
        </div>
      </div>

      {params.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {params.map((p) => (
            <label key={p.value} className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {p.value}
                {p.optional && (
                  <span className="ml-0.5 opacity-60">({t.optional})</span>
                )}
              </span>
              <Input
                value={values[p.value] ?? ''}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [p.value]: e.target.value }))
                }
                className="h-7 w-28 text-xs"
                placeholder={p.value}
              />
            </label>
          ))}
        </div>
      )}
    </li>
  )
}

/* ── 指令库 ── */

export function CommandBrowser({
  canRun,
  onRun
}: {
  canRun: boolean
  onRun: (command: string) => void
}) {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const t = dict.commands
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [limit, setLimit] = useState(PAGE_SIZE)

  // 螃蟹甲板是个计算器而不是指令集，这里不列
  const pickable = useMemo(
    () => categories.filter((c) => c.id !== 'calculator'),
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return commands.filter((c) => {
      if (category !== 'all' && c.category !== category) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.command.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const visible = filtered.slice(0, limit)

  const reset = (fn: () => void) => {
    fn()
    setLimit(PAGE_SIZE)
  }

  return (
    <div className="space-y-4">
      {/* 搜索 —— 1042 条指令的主要入口 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => reset(() => setQuery(e.target.value))}
          placeholder={t.searchPlaceholder.replace(
            '{count}',
            String(commands.length)
          )}
          className="pl-9 pr-9"
          aria-label={t.searchPlaceholder.replace('{count}', String(commands.length))}
        />
        {query && (
          <button
            type="button"
            onClick={() => reset(() => setQuery(''))}
            aria-label={t.clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 分类筛选：用可换行的胶囊代替原本 14 个标签页 */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => reset(() => setCategory('all'))}
          className={cn(
            'rounded-full border px-3 py-1 text-xs transition-colors',
            category === 'all'
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}
        >
          {t.filterAll}
        </button>
        {pickable.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => reset(() => setCategory(c.id))}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              category === c.id
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            {locale === 'en' ? c.nameEn : c.nameZh}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {t.resultCount
            .replace('{shown}', String(visible.length))
            .replace('{total}', String(filtered.length))}
        </p>
        {!canRun && (
          <Badge variant="outline" className="text-xs">
            {t.runNeedsLogin}
          </Badge>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {t.noResults}
          </CardContent>
        </Card>
      ) : (
        <>
          <ul className="space-y-2">
            {visible.map((cmd) => (
              <CommandItem
                key={cmd.id}
                cmd={cmd}
                canRun={canRun}
                onRun={onRun}
              />
            ))}
          </ul>
          {filtered.length > visible.length && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLimit((n) => n + PAGE_SIZE * 2)}
            >
              {t.loadMore}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
