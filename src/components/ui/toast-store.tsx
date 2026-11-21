'use client'

import * as React from 'react'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  Toaster
} from '@/components/ui/toast'

/* Snackbar 队列 —— 模块级最小状态机，避免为此套一层 Context。
 *
 * 用法：`const toast = useToast(); toast({ description: t.copied })`。
 * 同一时刻只保留最近一条（Snackbar 不堆叠，新的一条顶掉旧的），
 * 这样也不会把页面底部塞满。需要「撤销」这类动作时传 action。
 */
type ToastItem = {
  id: number
  title?: string
  description?: React.ReactNode
  action?: { label: string; onClick: () => void }
}

let seq = 0
let current: ToastItem | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const fn of listeners) fn()
}

export function toast(item: Omit<ToastItem, 'id'>) {
  current = { ...item, id: ++seq }
  emit()
}

export function dismissToast() {
  current = null
  emit()
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot() {
  return current
}

export function useToast() {
  return toast
}

/** 挂在根布局一次即可；没有可见 Snackbar 时 Toaster 是空的。 */
export function AppToaster() {
  const [item, setItem] = React.useState<ToastItem | null>(current)

  React.useEffect(() => {
    const fn = () => setItem(getSnapshot())
    const unsubscribe = subscribe(fn)
    fn()
    return unsubscribe
  }, [])

  return (
    <ToastProvider>
      {item && (
        <Toaster key={item.id}>
          <Toast open onOpenChange={(open) => !open && dismissToast()}>
            <div className="min-w-0 flex-1">
              {item.title && <ToastTitle>{item.title}</ToastTitle>}
              {item.description && <ToastDescription>{item.description}</ToastDescription>}
            </div>
            {item.action && (
              <ToastAction altText={item.action.label} onClick={item.action.onClick}>
                {item.action.label}
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        </Toaster>
      )}
    </ToastProvider>
  )
}
