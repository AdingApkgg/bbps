'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { CheckSquare, History, Play, Trash2 } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * 本地指令历史。
 * 游戏内单发一个 `/` 是「重复上一条」，网页做不到（空 command 会被 400 挡掉），
 * 所以在前端自己存一份，点一下即可重发。
 */
const KEY = 'bbps-command-history'
const MAX = 20

/**
 * localStorage 是外部存储，用 useSyncExternalStore 订阅：
 * 既避开「effect 里同步 setState」，也让 SSR 快照为空、水合不会不一致。
 */
const EMPTY: string[] = []
let cache: string[] = EMPTY
let cachedRaw: string | null = null
const listeners = new Set<() => void>()

function readSnapshot(): string[] {
 try {
 const raw = window.localStorage.getItem(KEY)
 if (raw !== cachedRaw) {
 cachedRaw = raw
 cache = raw ? (JSON.parse(raw) as string[]) : EMPTY
 }
 } catch {
 cache = EMPTY
 }
 return cache
}

function serverSnapshot(): string[] {
 return EMPTY
}

function subscribe(fn: () => void) {
 listeners.add(fn)
 return () => {
 listeners.delete(fn)
 }
}

function write(next: string[]) {
 try {
 window.localStorage.setItem(KEY, JSON.stringify(next))
 } catch {
 /* 隐私模式下不可用 */
 }
 cachedRaw = null // 强制下次重读
 listeners.forEach((f) => {
 f()
 })
}

export function useCommandHistory() {
 const items = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot)

 const push = useCallback((cmd: string) => {
 const v = cmd.trim()
 if (!v) return
 const prev = readSnapshot()
 write([v, ...prev.filter((x) => x !== v)].slice(0, MAX))
 }, [])

 const clear = useCallback(() => write([]), [])

 const remove = useCallback((cmds: string[]) => {
  const drop = new Set(cmds)
  write(readSnapshot().filter((x) => !drop.has(x)))
 }, [])

 return { items, push, clear, remove }
}

export function CommandHistory({
 items,
 canRun,
 onRun,
 onClear,
 onRemove
}: {
 items: string[]
 canRun: boolean
 onRun: (cmd: string) => void
 onClear: () => void
 onRemove: (cmds: string[]) => void
}) {
 const locale = useLocale()
 const t = getDictionary(locale).commands
 const [selected, setSelected] = useState<string[]>([])
 if (items.length === 0) return null

 const selecting = selected.length > 0

 const toggle = (cmd: string, on: boolean) => {
 setSelected((prev) => (on ? [cmd, ...prev] : prev.filter((x) => x !== cmd)))
 }

 return (
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <p className="flex items-center gap-1.5 text-label font-medium text-on-surface-medium">
 <History className="h-3.5 w-3.5" />
 {t.historyTitle}
 </p>
 <div className="ml-auto flex items-center gap-3">
 <button
 type="button"
 onClick={() => setSelected(items.slice())}
 className="flex items-center gap-1 text-label text-on-surface-medium hover:text-on-surface"
 >
 <CheckSquare className="h-3 w-3" />
 {t.historySelectAll}
 </button>
 {selecting ? (
 <>
 <button
 type="button"
 onClick={() => {
 onRemove(selected)
 setSelected([])
 }}
 className="flex items-center gap-1 text-label text-error"
 >
 <Trash2 className="h-3 w-3" />
 {t.historyDelete}
 </button>
 <button
 type="button"
 onClick={() => setSelected([])}
 className="text-label text-on-surface-medium hover:text-on-surface"
 >
 {t.historyExitSelect}
 </button>
 </>
 ) : (
 <button
 type="button"
 onClick={onClear}
 className="flex items-center gap-1 text-label text-on-surface-medium hover:text-on-surface"
 >
 <Trash2 className="h-3 w-3" />
 {t.historyClear}
 </button>
 )}
 </div>
 </div>
 <ul className="space-y-1">
 {items.map((cmd) => (
 <li key={cmd} className="flex items-center gap-2">
 <Checkbox
 id={`history-${cmd}`}
 checked={selected.includes(cmd)}
 onCheckedChange={(on) => toggle(cmd, on === true)}
 aria-label={cmd}
 />
 <label
 htmlFor={`history-${cmd}`}
 className="min-w-0 flex-1 cursor-pointer truncate bg-surface-variant-01 px-2 py-1 font-mono text-label"
 >
 {cmd}
 </label>
 <Button
 size="sm"
 variant="ghost"
 className="h-7 shrink-0 px-2"
 disabled={!canRun}
 onClick={() => onRun(cmd)}
 aria-label={t.historyRerun}
 >
 <Play className="h-3.5 w-3.5" />
 </Button>
 </li>
 ))}
 </ul>
 </div>
 )
}
