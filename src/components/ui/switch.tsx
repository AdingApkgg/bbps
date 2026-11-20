'use client'

import type * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* Switch
 *
 * Radix 承载开关语义。形状按 HIG 固定：51×31 胶囊、27px 拇指、开为 success 绿实心、
 * 关为通配灰，靠 `translate` 推拇指；HIG 开关只有一种尺寸，密度交给外层布局。
 * 外观全在本文件，`hig.css` 不再复述。
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative inline-flex h-(--md-sys-size-switch-track-h) w-(--md-sys-size-switch-track-w) shrink-0 items-center rounded-full',
        'border-0 bg-on-surface-medium/32 transition-colors duration-fast-01 ease-standard',
        'data-[state=checked]:bg-success',
        'before:absolute before:-inset-x-[7px] before:-inset-y-[17px] before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'data-[state=checked]:hover:enabled:before:bg-primary/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-[1.6875rem] rounded-full bg-surface-01 shadow-[var(--md-sys-shadow-thumb)]',
          'transition-[translate,background-color] duration-moderate-01 ease-standard',
          'data-[state=unchecked]:translate-x-[2px]',
          'data-[state=checked]:translate-x-[22px]',
          'data-[state=checked]:bg-on-button-contained',
          'peer-disabled:shadow-none',
          'peer-disabled:data-[state=unchecked]:bg-on-surface-disabled',
          'peer-disabled:data-[state=checked]:bg-on-button-contained'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
