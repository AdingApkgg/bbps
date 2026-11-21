'use client'

import type * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

/* Linear progress
 *
 * 结构是两段（轨道 + 填充，buffer 态再叠一层），形状按 HIG 收圆：
 * 4px 轨道两端走胶囊，不是直角。不确定态也是两段互相追赶，
 * 用 keyframes 写在 globals.css 的 .progress-indeterminate。
 *
 * 轨道本身没有 min-height，高度由 --hig-size-progress-height 决定，附着在 body 顶部时可设得更细。
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const pct = Math.max(0, Math.min(100, value ?? 0))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-(--hig-size-progress-height) w-full overflow-hidden rounded-full bg-primary/24',
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-[width] duration-moderate-01 ease-decelerate"
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

/* 不确定态：两段各自从 0 拉长到 70%/100% 再退出，
 * 元素本身只提供视觉轨道，aria 上仍要由调用方给 aria-label 或包一层 role。 */
function ProgressIndeterminate({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="progress-indeterminate"
      role="progressbar"
      aria-valuetext="loading"
      className={cn(
        'relative h-(--hig-size-progress-height) w-full overflow-hidden rounded-full bg-primary/24',
        className
      )}
      {...props}
    >
      <span className="progress-indeterminate-1 absolute inset-y-0 w-full bg-primary" />
      <span className="progress-indeterminate-2 absolute inset-y-0 w-full bg-primary" />
    </div>
  )
}

export { Progress, ProgressIndeterminate }
