'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

/* Material Design 2 Linear progress
 *
 * 规格取自 m2.material.io/components/progress-indicators 与 material-components-web 的
 * linear-progress/_variables.scss：
 *  - 轨道 4dp 直角，primary 24%；填充段 primary 实心；
 *  - 缓冲段（buffer）primary 24% 叠在已填充之后（base 12% / buffer 24% 的分层在 M2 里是两级）；
 *  - 不确定态是两段互相追赶的动画，用 keyframes 写在 globals.css 的 .md-linear-indeterminate。
 *
 * 轨道本身没有 min-height，高度由 --md-sys-size-progress-height 决定，附着在 body 顶部时可设得更细。
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
      className={cn('relative h-1 w-full overflow-hidden bg-primary/24', className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full bg-primary transition-[width] duration-moderate-01 ease-decelerate"
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

/* 不确定态：M2 的 linear indeterminate 是两段各自从 0 拉长到 70%/100% 再退出，
 * 元素本身只提供视觉轨道，aria 上仍要由调用方给 aria-label 或包一层 role。 */
function ProgressIndeterminate({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="progress-indeterminate"
      role="progressbar"
      aria-valuetext="loading"
      className={cn('relative h-1 w-full overflow-hidden bg-primary/24', className)}
      {...props}
    >
      <span className="md-linear-indeterminate-1 absolute inset-y-0 w-full bg-primary" />
      <span className="md-linear-indeterminate-2 absolute inset-y-0 w-full bg-primary" />
    </div>
  )
}

export { Progress, ProgressIndeterminate }
