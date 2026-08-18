'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 可搜索下拉框。
 *
 * 原生 <select> 在几百项时不好用：打字跳转只匹配开头且 1 秒重置，
 * 「Christmas_Tree圣诞树」这类名字打中文根本跳不过去。
 * 这里自己做一个带搜索框的，不引 cmdk 等新依赖。
 */

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  /** 选项少于这个数时不显示搜索框——2 项还弹个搜索栏是噪音 */
  searchThreshold?: number
}

/** 一次最多渲染这么多项，避免 263 项全进 DOM */
const RENDER_CAP = 50

export function SearchableSelect({
  value,
  options,
  onChange,
  ariaLabel,
  searchPlaceholder,
  emptyText,
  className,
  searchThreshold = 8
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const current = options.find((o) => o.value === value) ?? options[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const visible = filtered.slice(0, RENDER_CAP)
  const showSearch = options.length >= searchThreshold

  // 打开时聚焦搜索框
  useEffect(() => {
    if (open && showSearch) inputRef.current?.focus()
  }, [open, showSearch])

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // 高亮项滚动进视野
  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const commit = (v: string) => {
    onChange(v)
    setOpen(false)
    setQuery('')
    setActive(0)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setActive((i) => {
        const next = e.key === 'ArrowDown' ? i + 1 : i - 1
        if (next < 0) return visible.length - 1
        if (next >= visible.length) return 0
        return next
      })
      return
    }
    if (e.key === 'Enter' && open) {
      e.preventDefault()
      const pick = visible[active]
      if (pick) commit(pick.value)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex h-7 w-full items-center justify-between gap-1 rounded-md border bg-background px-2 text-xs"
      >
        <span className="truncate">{current?.label ?? ''}</span>
        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full min-w-[14rem] rounded-md border bg-popover shadow-md">
          {showSearch && (
            <div className="relative border-b">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                placeholder={searchPlaceholder}
                className="h-8 w-full bg-transparent pl-7 pr-2 text-xs outline-none"
              />
            </div>
          )}

          {visible.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              {emptyText}
            </p>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              aria-label={ariaLabel}
              className="max-h-56 overflow-y-auto py-1"
            >
              {visible.map((o, i) => (
                <li key={o.value} role="option" aria-selected={o.value === value}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => commit(o.value)}
                    className={cn(
                      'flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-xs',
                      i === active && 'bg-muted'
                    )}
                  >
                    <Check
                      className={cn(
                        'h-3 w-3 shrink-0',
                        o.value === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="truncate">{o.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {filtered.length > visible.length && (
            <p className="border-t px-2 py-1.5 text-center text-[10px] text-muted-foreground">
              {filtered.length - visible.length}+
            </p>
          )}
        </div>
      )}
    </div>
  )
}
