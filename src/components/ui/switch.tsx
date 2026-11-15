'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/* Material Design 2 Switch
 *
 * 规格取自 m2.material.io/components/switch 与 material-components-web 的
 * switch/_variables.scss：
 *  - 轨道 34×14 全圆头；未选中填充 onSurface 38%，选中填充 primary 38%；
 *  - 手柄 20dp 圆，未选中压在左侧、选中移到右侧，阴影 2dp，选中后填 primary；
 *  - 状态层叠在轨道外扩 7dp 的触达区上：hover 4%、focus 12%、pressed 12%；
 *  - focus 是 2px primary 描边，外扩 2px，与全站 :focus-visible 同款；
 *  - 轨道过渡 short-2(100ms)、手柄过渡 short-4(200ms)，都是 standard 曲线。
 *
 * 尺寸固定不开放 variant：M2 只有一种尺寸，密度靠外层布局处理。
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative inline-flex h-[14px] w-[34px] shrink-0 items-center rounded-full',
        'border-0 bg-on-surface-medium/38 transition-colors duration-fast-01 ease-standard',
        'data-[state=checked]:bg-primary/38',
        'before:absolute before:-inset-x-[7px] before:-inset-y-[17px] before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'data-[state=checked]:hover:enabled:before:bg-primary/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'disabled:cursor-not-allowed disabled:bg-on-surface-disabled/12',
        'disabled:data-[state=checked]:bg-on-surface-disabled/12',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-surface-01 shadow-sm',
          'transition-[transform,background-color] duration-moderate-01 ease-standard',
          'data-[state=unchecked]:translate-x-[2px]',
          'data-[state=checked]:translate-x-[12px]',
          'data-[state=checked]:bg-primary',
          'peer-disabled:shadow-none',
          'peer-disabled:data-[state=unchecked]:bg-on-surface-disabled',
          'peer-disabled:data-[state=checked]:bg-on-surface-disabled'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
