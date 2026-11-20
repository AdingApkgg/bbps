'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import {
  COMMANDS_BY_GROUP,
  LAYOUT_OPTIONS,
  paramHint,
  searchCatalog,
  type CatalogCommand
} from '@/lib/commands'
import { fillTemplate, isTemplateReady, parseTemplate } from '@/lib/command-template'
import { entityOptions, entityParamLabel } from '@/lib/entity-options'
import { commandNote } from '@/lib/generated/command-notes'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RunButton } from '@/components/run-button'
import { SearchableSelect } from '@/components/searchable-select'
import { toast } from '@/components/ui/toast-store'
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
  // 参数表单默认收起 —— 常驻展开时它占了整页 17% 的高度，
  // 而绝大多数指令用户只是路过看看
  const [formOpen, setFormOpen] = useState(false)

  const params = useMemo(
    () => parseTemplate(item.syntax).filter((p) => p.type === 'param'),
    [item.syntax]
  )
  // 只有必填参数才值得把「执行」挡在表单后面。
  // `[<player>]` 这类可选参数留空就能跑（/attackplayer 留空即打自己），
  // 按 params.length 判断会把 14 条本来一键可执行的指令变成两步。
  const required = useMemo(() => params.filter((p) => !p.optional), [params])
  const final = fillTemplate(item.syntax, values)
  const ready = isTemplateReady(item.syntax, values)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(final)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      toast({ description: t.copied })
    } catch {
      toast({ description: t.copyFailed })
    }
  }

  return (
    <ul
      className={cn(
        'ml-4 border-l pl-3',
        item.danger === 'destructive' && 'border-error',
        item.danger === 'warn' && 'border-warning',
        !item.danger && 'border-transparent'
      )}
    >
      <li className="py-3 pr-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <code className="break-all font-mono text-body-02 font-medium">{item.syntax}</code>
              {item.danger === 'destructive' && (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {t.dangerDestructive}
                </Badge>
              )}
              {item.danger === 'warn' && (
                <Badge variant="warm-gray" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {t.dangerWarn}
                </Badge>
              )}
              {item.queryOnly && <Badge variant="secondary">{t.queryOnly}</Badge>}
              {item.needsHome && <Badge variant="secondary">{t.needsHome}</Badge>}
            </div>
            {/* 说明来自 src/content/command-notes.zh.md（可由 AI 维护），
           commands.ts 的 desc 仅作兜底。语法与危险标记不在 md 里。 */}
            <p className="mt-1 text-body-02 text-on-surface-medium">
              {commandNote(item.cmd) ?? item.desc}
            </p>
            {item.aliases.length > 0 && (
              <p className="mt-1 flex flex-wrap items-center gap-1 text-label text-on-surface-medium">
                <span>{t.aliases}</span>
                {item.aliases.map((a) => (
                  <code key={a} className="bg-surface-variant-01 px-1 font-mono">
                    {a}
                  </code>
                ))}
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} aria-label={t.copyButton}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {!item.inGameOnly &&
              !item.advancedOnly &&
              (required.length > 0 && !formOpen ? (
                // 有必填参数时先展开表单，而不是直接发一条缺参数的指令
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
                  {t.fillParams.replace('{n}', String(required.length))}
                </Button>
              ) : (
                <>
                  {/* 全是可选参数：一键就能执行，但仍要留个入口去填它们 */}
                  {params.length > 0 && !formOpen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormOpen(true)}
                      aria-label={t.optionalParams}
                      title={t.optionalParams}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <RunButton
                    command={final}
                    danger={item.danger}
                    canRun={canRun}
                    disabled={!ready}
                    onRun={onRun}
                  />
                </>
              ))}
          </div>
        </div>

        {item.inGameOnly && (
          <p className="mt-2 rounded-xs bg-surface-variant-01 px-2 py-2 text-label text-on-surface-medium">
            {t.inGameOnly}
          </p>
        )}
        {item.advancedOnly && (
          <p className="mt-2 rounded-xs bg-surface-variant-01 px-2 py-2 text-label text-on-surface-medium">
            {t.advancedOnlyHint}
          </p>
        )}

        {/* 带参数的指令：展开小表单，而不是直接发一条缺参数的指令 */}
        {params.length > 0 && formOpen && !item.inGameOnly && !item.advancedOnly && (
          <div className="mt-2 ml-2 space-y-2 border-l border-outline-variant-01 pl-3">
            {params.map((p) => {
              const hint = paramHint(p.value, locale)
              const label2 = (o: { value: string; labelZh: string; labelEn: string }) => ({
                value: o.value,
                label: locale === 'en' ? o.labelEn : o.labelZh
              })
              // 取值来源优先级：条目自带的 paramOptions（带中文标签）→
              // 参数名本身是枚举（如 island|warship）→ layout 类 →
              // 游戏实体（部队/建筑/资源/雕刻/母舰技能，复用「指令库」那份数据）
              const declared = item.paramOptions?.[p.value]
              const entity = declared ? null : entityOptions(p.value)
              const options: { value: string; label: string }[] | null = declared
                ? declared.map(label2)
                : p.value.includes('|')
                  ? p.value
                      .split('|')
                      .map((x) => x.trim())
                      .filter(Boolean)
                      .map((v) => ({ value: v, label: v }))
                  : p.value.toLowerCase().includes('layout')
                    ? LAYOUT_OPTIONS.map(label2)
                    : entity
                      ? entity.map(label2)
                      : null
              // 枚举参数名太长，标签改用通用词，取值由下拉自身呈现；
              // 实体参数沿用服务端形参名（character…），换成看得懂的说法
              const label = p.value.includes('|')
                ? t.optionLabel
                : (entityParamLabel(p.value, locale) ?? p.value)
              return (
                <div key={p.value} className="flex flex-wrap items-center gap-2">
                  <span className="w-20 shrink-0 text-label text-on-surface-medium">
                    {label}
                    {p.optional && <span className="ml-0.5 opacity-60">({t.optional})</span>}
                  </span>
                  {options ? (
                    <SearchableSelect
                      className="w-44"
                      value={values[p.value] ?? ''}
                      onChange={(v) => setValues((prev) => ({ ...prev, [p.value]: v }))}
                      ariaLabel={label}
                      searchPlaceholder={t.pickerSearch}
                      emptyText={t.noResults}
                      options={[{ value: '', label: '—' }, ...options]}
                    />
                  ) : (
                    <Input
                      value={values[p.value] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [p.value]: e.target.value }))}
                      placeholder={p.value}
                      className="h-7 w-40 text-label"
                    />
                  )}
                  {hint && (
                    <span className="w-full text-caption text-on-surface-medium sm:w-auto sm:flex-1">
                      {hint}
                    </span>
                  )}
                </div>
              )
            })}
            <code className="block break-all bg-surface-variant-01 px-2 py-1 font-mono text-label">
              {final}
            </code>
          </div>
        )}
      </li>
    </ul>
  )
}

/* ── 目录 ── */

export function CommandCatalog({
  canRun,
  onRun,
  openAll = null
}: {
  canRun: boolean
  onRun: (command: string) => void
  /* 外部一键展开/收起：null 跟随每个分组自带的默认（除两个特殊组外都是收起） */
  openAll?: boolean | null
}) {
  const locale = useLocale()
  const t = getDictionary(locale).commands
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const matched = useMemo(() => new Set(searchCatalog(query)), [query])
  const searching = query.trim().length > 0

  return (
    <div className="space-y-4">
      {/* 搜索框吸在顶栏下：目录很长，滚到一半也能直接改词，不必先滚回去
       *  顶栏高度由 hig.css 钉在 --md-sys-size-lg（44px），这里跟着走 */}
      <div className="sticky top-(--md-sys-size-lg) z-10 -mx-1 bg-surface px-1 py-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-medium" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.catalogSearch}
            className="pl-8 pr-8"
            aria-label={t.catalogSearch}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-medium hover:text-on-surface"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
        {COMMANDS_BY_GROUP.map(({ meta, items }) => {
          const visible = items.filter((i) => matched.has(i))
          if (visible.length === 0) return null
          // 搜索时一律展开；外部一键控制优先，否则默认全收起
          // （9 个普通组以前默认摊开，单页 17 000px 就是这么来的）
          const expanded = searching || (openAll ?? open[meta.id] ?? false)

          return (
            <div key={meta.id} data-list-item>
              <button
                type="button"
                className="flex w-full cursor-pointer items-start justify-between gap-2 px-4 py-3 text-left select-none"
                onClick={() => setOpen((o) => ({ ...o, [meta.id]: !expanded }))}
                aria-expanded={expanded}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-body-01 font-semibold">
                    {locale === 'en' ? meta.labelEn : meta.labelZh}
                    <Badge variant="secondary">{visible.length}</Badge>
                  </span>
                  {(meta.noteZh || meta.noteEn) && (
                    <span className="mt-1 block text-label text-on-surface-medium">
                      {locale === 'en' ? meta.noteEn : meta.noteZh}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-on-surface-medium transition-transform duration-fast-01',
                    expanded && 'rotate-180'
                  )}
                />
              </button>
              {expanded && (
                <ul>
                  {visible.map((item) => (
                    <CatalogItem key={item.cmd} item={item} canRun={canRun} onRun={onRun} />
                  ))}
                </ul>
              )}
            </div>
          )
        })}

        {matched.size === 0 && (
          <p className="rounded-sm bg-surface-02 py-10 text-center text-body-02 text-on-surface-medium">
            {t.noResults}
          </p>
        )}
      </div>
    </div>
  )
}
