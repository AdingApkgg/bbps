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
 const listRef = useRef<HTMLDivElement>(null)

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
 // biome-ignore lint/a11y/noStaticElementInteractions: 组合框惯例，键盘事件代内部的触发按钮与选项列表捕获，根节点本身不是控件
 <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
 <button
 type="button"
 onClick={() => setOpen((o) => !o)}
 aria-haspopup="listbox"
 aria-expanded={open}
 aria-label={ariaLabel}
 className="flex h-(--md-sys-size-field) min-h-0 w-full items-center justify-between gap-1 rounded-t-sm bg-field-01 pl-4 pr-3 text-body-01 text-on-surface shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface-placeholder)] transition-[background-color,box-shadow] duration-fast-02 ease-standard outline-none hover:bg-field-hover-01 focus:bg-field-hover-01 focus:shadow-[inset_0_-2px_0_var(--md-sys-color-focus)]"
 >
 <span className="truncate">{current?.label ?? ''}</span>
 <ChevronsUpDown className="size-4 shrink-0 text-on-surface-medium" />
 </button>

 {open && (
 <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full min-w-[14rem] overflow-hidden rounded-sm bg-surface-02 py-2 shadow-scrim">
 {showSearch && (
 <div className="mx-2 mb-1 flex items-center gap-2 border-b border-outline pl-2 focus-within:border-outline-active">
 <Search className="pointer-events-none size-4 shrink-0 text-on-surface-medium" />
 <input
 ref={inputRef}
 value={query}
 onChange={(e) => {
 setQuery(e.target.value)
 setActive(0)
 }}
 placeholder={searchPlaceholder}
 aria-label={searchPlaceholder}
 className="h-10 min-h-0 w-full bg-transparent pr-2 text-body-02 outline-none placeholder:text-on-surface-placeholder"
 />
 </div>
 )}

 <div className="max-h-64 overflow-y-auto">
 {visible.length === 0 ? (
 <p className="px-4 py-3 text-center text-body-02 text-on-surface-medium">{emptyText}</p>
 ) : (
 /*
 用 div 而不是 ul/li：listbox / option 是交互角色，套在列表语义
 元素上会和它们自带的语义打架。
 */
 <div ref={listRef} role="listbox" aria-label={ariaLabel}>
 {visible.map((o, i) => (
 /* role 挂在真正可聚焦的按钮上，不再套一层只为承载 role 的 div */
 <button
 key={o.value}
 type="button"
 role="option"
 aria-selected={o.value === value}
 onMouseEnter={() => setActive(i)}
 onClick={() => commit(o.value)}
 className={cn(
 'flex h-(--md-sys-size-row) w-full items-center gap-2 pl-4 pr-2 text-left text-body-01 transition-colors duration-fast-02',
 i === active && 'bg-state-pressed'
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
 ))}
 </div>
 )}

 {filtered.length > visible.length && (
 <p className="border-t px-2 py-1.5 text-center text-label text-on-surface-medium">
 {filtered.length - visible.length}+
 </p>
 )}
 </div>
 </div>
 )}
 </div>
 )
}
