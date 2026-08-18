'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Play, Search, X } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { categories, commands, type Command } from '@/lib/commands-data'
import {
  optionLabel,
  searchEntries,
  type CommandGroup
} from '@/lib/command-groups'
import {
  fillTemplate,
  isRunnable,
  isTemplateReady,
  parseTemplate
} from '@/lib/command-template'
import {
  applyNumbers,
  displayName,
  extractNumbers,
  matchFamily
} from '@/lib/command-families'
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
  const [copied, setCopied] = useState(false)

  // 两套可编辑机制：家族数值参数（698 条），或显式 <参数> 占位符（114 条）
  const family = useMemo(() => matchFamily(cmd.command), [cmd.command])
  const originalNumbers = useMemo(
    () => (family ? extractNumbers(cmd.command) : []),
    [family, cmd.command]
  )
  const [numbers, setNumbers] = useState<string[]>(originalNumbers)
  const [values, setValues] = useState<Record<string, string>>({})

  const parts = useMemo(() => parseTemplate(cmd.command), [cmd.command])
  const params = parts.filter((p) => p.type === 'param')

  const final = family
    ? applyNumbers(cmd.command, numbers)
    : fillTemplate(cmd.command, values)
  const ready = family ? true : isTemplateReady(cmd.command, values)
  const runnable = isRunnable(cmd.command)
  const isColorSnippet = /^<c[0-9A-Fa-f]{6}>/.test(cmd.command)
  const label = displayName(cmd.name, family)
  const edited = family && numbers.some((n, i) => n !== originalNumbers[i])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(final)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用时静默 */
    }
  }

  const setNumberAt = (index: number, v: string) =>
    setNumbers((prev) => {
      const next = [...(prev.length ? prev : originalNumbers)]
      next[index] = v.replace(/[^\d]/g, '')
      return next
    })

  return (
    <li className="rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <code className="mt-0.5 block break-all font-mono text-xs text-muted-foreground">
            {isColorSnippet ? <PlayerName name={cmd.command} /> : final}
          </code>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {edited && (
            <button
              type="button"
              onClick={() => setNumbers(originalNumbers)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t.resetValues}
            </button>
          )}
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

      {/* 家族数值：把写死的数量/等级/坐标开放成输入框，实体位保持不动 */}
      {family && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {family.args
            .filter((a) => a.role === 'value')
            .map((a) => {
              const listId = `${cmd.id}-${a.index}`
              return (
                <label key={a.index} className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    {locale === 'en' ? a.labelEn : a.labelZh}
                  </span>
                  <Input
                    inputMode="numeric"
                    value={numbers[a.index] ?? originalNumbers[a.index] ?? ''}
                    onChange={(e) => setNumberAt(a.index, e.target.value)}
                    className="h-7 w-24 text-xs"
                    list={a.presets ? listId : undefined}
                  />
                  {a.presets && (
                    <datalist id={listId}>
                      {a.presets.map((v) => (
                        <option key={v} value={v} />
                      ))}
                    </datalist>
                  )}
                </label>
              )
            })}
        </div>
      )}

      {/* 显式 <参数> 占位符 */}
      {!family && params.length > 0 && (
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

/* ── 折叠组：一行 + 实体下拉框 ── */

function GroupItem({
  group,
  matched,
  canRun,
  onRun
}: {
  group: CommandGroup
  matched: Command[]
  canRun: boolean
  onRun: (command: string) => void
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [copied, setCopied] = useState(false)

  // 搜索命中时下拉框只留命中项，并默认选中最相关的那个
  const options = matched.length > 0 ? matched : group.options
  const [selectedId, setSelectedId] = useState(options[0]?.id)
  const current =
    options.find((o) => o.id === selectedId) ?? options[0] ?? group.options[0]

  const originalNumbers = useMemo(
    () => extractNumbers(current.command),
    [current.command]
  )
  const [numbers, setNumbers] = useState<string[]>([])
  // 切换实体后数值回到该条目的原值
  const effective = numbers.length ? numbers : originalNumbers
  const final = applyNumbers(current.command, effective)
  const edited = numbers.length > 0 && numbers.some((n, i) => n !== originalNumbers[i])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setNumbers([])
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(final)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用时静默 */
    }
  }

  const setNumberAt = (index: number, v: string) =>
    setNumbers((prev) => {
      const next = [...(prev.length ? prev : originalNumbers)]
      next[index] = v.replace(/[^\d]/g, '')
      return next
    })

  return (
    <li className="rounded-lg border p-3 transition-colors hover:bg-muted/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {locale === 'en' ? group.labelEn : group.labelZh}
            </p>
            <Badge variant="secondary" className="text-[10px]">
              {t.groupCount.replace('{n}', String(options.length))}
            </Badge>
          </div>
          <code className="mt-0.5 block break-all font-mono text-xs text-muted-foreground">
            {final}
          </code>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {edited && (
            <button
              type="button"
              onClick={() => setNumbers([])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t.resetValues}
            </button>
          )}
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
          <Button
            size="sm"
            onClick={() => onRun(final)}
            disabled={!canRun}
            title={!canRun ? t.runNeedsLogin : undefined}
          >
            <Play className="mr-1 h-3.5 w-3.5" />
            {t.runButton}
          </Button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {/* 用原生 select：几百个选项时可打字跳转，移动端直接调系统选择器 */}
        <select
          value={current.id}
          onChange={(e) => handleSelect(e.target.value)}
          aria-label={locale === 'en' ? group.labelEn : group.labelZh}
          className="h-7 max-w-[15rem] flex-1 rounded-md border bg-background px-2 text-xs"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {optionLabel(o, group.family)}
            </option>
          ))}
        </select>

        {group.family.args
          .filter((a) => a.role === 'value')
          .map((a) => {
            const listId = `${group.id}-${a.index}`
            return (
              <label key={a.index} className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {locale === 'en' ? a.labelEn : a.labelZh}
                </span>
                <Input
                  inputMode="numeric"
                  value={effective[a.index] ?? ''}
                  onChange={(e) => setNumberAt(a.index, e.target.value)}
                  className="h-7 w-20 text-xs"
                  list={a.presets ? listId : undefined}
                />
                {a.presets && (
                  <datalist id={listId}>
                    {a.presets.map((v) => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                )}
              </label>
            )
          })}
      </div>
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

  const filtered = useMemo(
    () => searchEntries(query, category),
    [query, category]
  )

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

      <p className="text-xs text-muted-foreground">{t.collapsedHint}</p>

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
            {visible.map((entry) =>
              entry.kind === 'group' ? (
                <GroupItem
                  // 搜索结果变化时重建，让下拉框重新选中最相关项
                  key={entry.group.id + ':' + (entry.matched[0]?.id ?? '')}
                  group={entry.group}
                  matched={entry.matched}
                  canRun={canRun}
                  onRun={onRun}
                />
              ) : (
                <CommandItem
                  key={entry.cmd.id}
                  cmd={entry.cmd}
                  canRun={canRun}
                  onRun={onRun}
                />
              )
            )}
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
