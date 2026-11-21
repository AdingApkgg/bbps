'use client'

import type * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Toast（snackbar）
 *
 * 结构沿用吐司惯例：反色底、onInverse 文字、操作与关闭在右，
 * 从底部进入（入场 decelerate、退场 accelerate），默认 4s 自动消失。
 * 形状按 HIG 收圆（`hig.css` 的 `[data-slot="toast"]` 钩子）：深色胶囊 + 单层淡影。
 *
 * 用 Radix Toast 承载：它给 role=status/alert、F6 跳转、swipe 关闭与 live region，
 * 这些无障碍语义必须保留。Toaster 是视口，挂一次即可。
 *
 * 槽位 `--hig-cmp-toast-*`，父级赋值即覆盖。
 */
const toastVariants =
  'pointer-events-auto flex w-full items-center gap-2 rounded-(--hig-cmp-toast-radius,var(--hig-shape-overlay)) px-(--hig-cmp-toast-px,1rem) text-body-02 shadow-snackbar'

function ToastProvider(props: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider duration={4000} swipeDirection="down" {...props} />
}

function Toaster({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'fixed inset-x-0 bottom-0 z-(--hig-layer-toast) m-0 flex w-full list-none flex-col gap-2 p-4',
        // 桌面端右下角一列，固定最大宽度，不铺满
        'sm:inset-x-auto sm:end-0 sm:bottom-0 sm:max-w-sm',
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Root>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        toastVariants,
        'min-h-(--hig-cmp-toast-min-h,var(--hig-size-row)) max-w-full bg-(--hig-cmp-toast-bg,var(--hig-color-inverse-surface)) text-(--hig-cmp-toast-fg,var(--hig-color-label-inverse)) sm:max-w-(--hig-cmp-toast-max-w,var(--hig-size-toast-width))',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full',
        'data-[state=open]:duration-moderate-01 data-[state=closed]:duration-moderate-01',
        'data-[state=open]:ease-entrance data-[state=closed]:ease-exit',
        'data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0 data-[swipe=end]:slide-out-to-bottom-full',
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn('block text-body-02', className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        'text-body-02 text-(--hig-cmp-toast-desc-fg,var(--hig-color-label-inverse)/70)',
        className
      )}
      {...props}
    />
  )
}

/* 操作是 primary 色的文本按钮（反色底上要用浅 primary） */
function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        'ms-auto shrink-0 rounded-(--hig-cmp-toast-action-radius,var(--hig-shape-control)) px-(--hig-cmp-toast-action-px,0.5rem) py-2 text-(length:--hig-cmp-toast-action-size,0.9375rem) font-(--hig-cmp-toast-action-weight,600) tracking-(--hig-cmp-toast-action-tracking,0.02em) uppercase text-(--hig-cmp-toast-action-fg,var(--hig-color-on-inverse-primary))',
        'transition-colors duration-fast-02 ease-standard',
        'hover:bg-(--hig-color-label-inverse)/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hig-color-label-inverse)',
        className
      )}
      {...props}
    />
  )
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="关闭"
      className={cn(
        'shrink-0 rounded-sm p-1 text-(--hig-cmp-toast-close-fg,var(--hig-color-label-inverse)/70) transition-colors duration-fast-02 ease-standard',
        'hover:bg-(--hig-cmp-toast-hover-bg,var(--hig-color-label-inverse)/8) hover:text-(--hig-cmp-toast-close-fg-hover,var(--hig-color-label-inverse))',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hig-color-label-inverse)',
        className
      )}
      {...props}
    >
      <X aria-hidden className="size-4" />
    </ToastPrimitive.Close>
  )
}

export {
  ToastProvider,
  Toaster,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastPrimitive
}
