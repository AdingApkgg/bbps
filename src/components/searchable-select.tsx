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
/** 列表最高 256px（约五行半），与旧 max-h-64 一致 */
const LIST_MAX = 256
/** 单行估算高度，用于判断放得下几行；实际行高由 --md-sys-size-row 决定 */
const ROW_ESTIMATE = 44

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
  const [placement, setPlacement] = useState<'below' | 'above'>('below')
  const [listMaxHeight, setListMaxHeight] = useState(256)
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

  /**
 弹层朝哪边开、最高多高，必须按可视区算，不能固定 `top-100%`：
 移动端字段常在屏幕底部，往下 319px 会直接戳出视口、压到底栏下面，
 最后几项既看不见也点不到。有底部常驻栏时以它的上沿为界。
 */
  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    const measure = () => {
      const trigger = root?.querySelector('button')
      if (!trigger) return
      const r = trigger.getBoundingClientRect()
      // 所有可见常驻件的上沿里最靠上的那条，就是弹层真正的下边界
      const edges = [...document.querySelectorAll('[data-dock]')]
        .map((el) => el.getBoundingClientRect().top)
        .filter((top) => top > 0 && top < innerHeight)
      const bottomEdge = edges.length ? Math.min(...edges) : innerHeight
      const roomBelow = Math.max(0, bottomEdge - 8 - r.bottom)
      const roomAbove = Math.max(0, r.top - 8)
      // 下方连三行都放不下、且上方更宽裕时向上开
      const flip = roomBelow < ROW_ESTIMATE * 3 && roomAbove > roomBelow
      setPlacement(flip ? 'above' : 'below')
      // 扣掉搜索框与上下内边距，剩下的才是列表能占的高度
      const chrome = showSearch ? ROW_ESTIMATE + 16 : 16
      setListMaxHeight(
        Math.max(ROW_ESTIMATE * 2, Math.min(LIST_MAX, (flip ? roomAbove : roomBelow) - chrome))
      )
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    // 播放条出现 / 消失会改变下边界，跟着重量一次
    const mo = new ResizeObserver(measure)
    for (const el of document.querySelectorAll('[data-dock]')) mo.observe(el)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      mo.disconnect()
    }
  }, [open, showSearch])

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
    if (e.key === 'End' || e.key === 'Home') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      // 263 项的命令表靠 End / Home 直达，手动按方向键要按到底
      setActive(e.key === 'End' ? visible.length - 1 : 0)
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
        className="flex h-(--md-sys-size-field) min-h-0 w-full items-center justify-between gap-1 rounded-sm border border-outline-field bg-field-01 pl-4 pr-3 text-body-01 text-on-surface shadow-none transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard outline-none hover:border-outline-emphasis-01 hover:bg-field-hover-01 focus:border-primary focus:bg-surface-01 focus:shadow-[0_0_0_3px_var(--md-sys-color-highlight)] aria-expanded:border-primary aria-expanded:bg-surface-01 aria-expanded:shadow-[0_0_0_3px_var(--md-sys-color-highlight)]"
      >
        <span className="truncate">{current?.label ?? ''}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-on-surface-medium" />
      </button>

      {open && (
        <div
          data-slot="popover"
          className={cn(
            'absolute left-0 z-(--md-sys-layer-popover) w-full min-w-[14rem] overflow-hidden rounded-sm bg-surface-02 py-2',
            placement === 'above' ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'
          )}
        >
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
                className="h-10 min-h-0 w-full border-0 bg-transparent pr-2 text-body-02 text-on-surface caret-on-surface outline-none placeholder:text-on-surface-placeholder"
              />
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: listMaxHeight }}>
            {visible.length === 0 ? (
              <p className="px-4 py-3 text-center text-body-02 text-on-surface-medium">
                {emptyText}
              </p>
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
              <p className="border-t px-2 py-2 text-center text-label text-on-surface-medium">
                {filtered.length - visible.length}+
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
