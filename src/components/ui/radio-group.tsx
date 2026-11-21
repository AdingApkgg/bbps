'use client'

import type * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/* Radio
 *
 * 外圈 20×20、1.5px 描边，选中是 primary 实心圆点（内环 5px），形状与颜色由
 * 形状按 HIG：20×20 圆、1.5px 描边；选中是 primary 描边 + primary 实心点。
 * 状态层仍在 40px 触达圆上。外观全在本文件，`hig.css` 不再复述。
 *
 * 组本身用 Radix 的 RadioGroup，天然带方向键 + roving tabindex。
 *
 * `variant="segmented"` 把它变成分段控件：去掉圆圈、铺成一条底槽、选中项用
 * surface-01 实底 + 描边淡影，与 `Tabs` 长一样。
 */
function RadioGroup({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { variant?: 'segmented' }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      data-variant={variant}
      className={cn(
        'group grid gap-2',
        variant === 'segmented' &&
          'inline-flex w-fit items-stretch gap-0.5 rounded-sm bg-surface-variant-01 p-0.5',
        className
      )}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'peer relative inline-flex size-5 shrink-0 items-center justify-center gap-2 rounded-full',
        'border-(--hig-size-border-thin) border-outline-01 bg-transparent',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-(--hig-size-hit-halo) before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'data-[state=checked]:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-45',
        // 分段按钮形态：2rem 高、8px 圆角、选中抬起的面
        'group-data-[variant=segmented]:h-8 group-data-[variant=segmented]:w-auto',
        'group-data-[variant=segmented]:rounded-08 group-data-[variant=segmented]:border-0 group-data-[variant=segmented]:shadow-none',
        'group-data-[variant=segmented]:px-4 group-data-[variant=segmented]:py-2',
        'group-data-[variant=segmented]:text-body-02 group-data-[variant=segmented]:font-medium',
        'group-data-[variant=segmented]:gap-0',
        'group-data-[variant=segmented]:before:hidden',
        'group-data-[variant=segmented]:text-on-surface-medium',
        'group-data-[variant=segmented]:hover:enabled:text-on-surface',
        'group-data-[variant=segmented]:data-[state=checked]:bg-surface-01',
        'group-data-[variant=segmented]:data-[state=checked]:font-semibold',
        'group-data-[variant=segmented]:data-[state=checked]:text-on-surface',
        'group-data-[variant=segmented]:data-[state=checked]:shadow-[var(--hig-shadow-hairline),var(--hig-shadow-raised-small)]',
        className
      )}
      {...props}
    >
      {children}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="block size-2 rounded-full bg-primary peer-disabled:bg-on-surface-disabled group-data-[variant=segmented]:hidden"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
