'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Material Design 2 Snackbar
 *
 * 规格取自 m2.material.io/components/snackbars 与 material-components-web 的
 * snackbar/_variables.scss：
 *  - surface 反色（onSurface 反相）底、onInverse 文字、radius 4dp、elevation 6dp；
 *  - 单行高 48dp，含操作时操作在右、文字与操作之间留 8dp；
 *  - 从底部进入（inverse 方向位移），入场 medium-1 + decelerate、退场 short-4 + accelerate；
 *  - 默认 4s 自动消失，hover/focus 时不暂停（M2 明确不支持暂停，除非带操作）。
 *
 * 用 Radix Toast 承载：它给 role=status/alert、F6 跳转、swipe 关闭与 live region，
 * 这些 M2 文档没写但无障碍上必要。Toaster 是视口，挂一次即可。
 */
const toastVariants = 'pointer-events-auto flex w-full items-center gap-2 rounded-sm px-4 text-body-02 shadow-snackbar'

function ToastProvider(props: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider duration={4000} swipeDirection="down" {...props} />
}

function Toaster({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 m-0 flex w-full list-none flex-col gap-2 p-4',
        // 桌面端右下角一列，固定最大宽度，不铺满
        'sm:inset-x-auto sm:right-0 sm:bottom-0 sm:max-w-sm',
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
        'min-h-12 max-w-full bg-inverse-surface text-on-inverse-surface sm:max-w-[344px]',
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
      className={cn('text-body-02 text-on-inverse-surface/70', className)}
      {...props}
    />
  )
}

/* M2 的 Snackbar 操作是 primary 色的文本按钮（反色底上要用浅 primary） */
function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        'ml-auto shrink-0 rounded-sm px-2 py-1.5 text-button text-on-inverse-primary uppercase',
        'transition-colors duration-fast-02 ease-standard',
        'hover:bg-on-inverse-surface/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-inverse-surface',
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
        'shrink-0 rounded-sm p-1 text-on-inverse-surface/70 transition-colors duration-fast-02 ease-standard',
        'hover:bg-on-inverse-surface/8 hover:text-on-inverse-surface',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-inverse-surface',
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
