'use client'

import type * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* Switch
 *
 * Radix 承载开关语义。形状按 HIG 固定：51×31 胶囊、27px 拇指、开为 success 绿实心、
 * 关为通配灰，靠 `translate` 推拇指；HIG 开关只有一种尺寸，密度交给外层布局。
 *
 * 外观是**单一来源**，只在本文件：`hig.css` 里不再有任何 [data-slot="switch"] 规则。
 * 拇指恒为白（不是 surface-01，否则暗色下拇指变黑），行走 `--hig-palette-white`。
 * 位移 2px / 22px = 51 − 27 − 2，与轨道宽同源，改轨道宽要同步改这里。
 *
 * 外观过 `--hig-cmp-switch-*` 槽，父级赋值即覆盖；位移也可覆盖（`-on` / `-off`）。
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative inline-flex h-(--hig-cmp-switch-track-h,var(--hig-size-switch-track-h)) w-(--hig-cmp-switch-track-w,var(--hig-size-switch-track-w)) shrink-0 items-center rounded-full',
        'border-0 bg-(--hig-cmp-switch-track-bg,var(--hig-color-fill-quaternary)) transition-colors duration-fast-01 ease-standard',
        'data-[state=checked]:bg-(--hig-cmp-switch-track-bg-on,var(--hig-color-success))',
        'before:absolute before:-inset-x-(--hig-size-switch-halo-x) before:-inset-y-(--hig-size-switch-halo-y) before:rounded-full before:content-[""]',
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
          'pointer-events-none block size-(--hig-cmp-switch-thumb,var(--hig-size-switch-thumb)) rounded-full bg-(--hig-cmp-switch-thumb-bg,var(--hig-palette-white)) shadow-[var(--hig-shadow-thumb)]',
          'transition-[translate,background-color] duration-moderate-01 ease-standard',
          'data-[state=unchecked]:translate-x-(--hig-cmp-switch-offset-off,2px)',
          'data-[state=checked]:translate-x-(--hig-cmp-switch-offset-on,22px)',
          'data-[state=checked]:bg-(--hig-cmp-switch-thumb-bg-on,var(--hig-color-on-button-contained))',
          'peer-disabled:shadow-none',
          'peer-disabled:data-[state=unchecked]:bg-on-surface-disabled'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
