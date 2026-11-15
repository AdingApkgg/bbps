'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/* Material Design 2 Radio
 *
 * 规格取自 m2.material.io/components/radio-buttons 与 material-components-web 的
 * radio/_variables.scss：
 *  - 外圈 20×20、2dp 边框；未选中边框 = onSurface 54%，选中 = primary；
 *  - 选中时内圆 10×10 primary，居中；
 *  - 状态层叠在 40dp 触达圆上：hover 4%、focus 12%、pressed 12%；
 *  - focus 是 2px primary 描边，外扩 2px。
 *
 * 组本身用 Radix 的 RadioGroup，天然带方向键 + roving tabindex。
 *
 * `variant="segmented"` 把它变成 M2 分段按钮：去掉圆圈、铺成一条底槽、
 * 选中项用 8% primary 状态层着色（segmented button 的 selected 态）。
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
      className={cn('group grid gap-2', className)}
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
        'border-2 border-on-surface-medium bg-transparent',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-[10px] before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'data-[state=checked]:border-outline-active',
        'disabled:cursor-not-allowed disabled:border-on-surface-disabled',
        // 分段按钮形态
        'group-data-[variant=segmented]:size-auto group-data-[variant=segmented]:rounded-none',
        'group-data-[variant=segmented]:border-0 group-data-[variant=segmented]:px-4 group-data-[variant=segmented]:py-1.5',
        'group-data-[variant=segmented]:text-body-02 group-data-[variant=segmented]:font-medium',
        'group-data-[variant=segmented]:gap-0',
        'group-data-[variant=segmented]:before:hidden',
        'group-data-[variant=segmented]:text-on-surface-medium',
        'group-data-[variant=segmented]:hover:enabled:text-on-surface',
        'group-data-[variant=segmented]:data-[state=checked]:bg-surface-selected-01',
        'group-data-[variant=segmented]:data-[state=checked]:text-on-surface',
        className
      )}
      {...props}
    >
      {children}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="block size-2.5 rounded-full bg-primary peer-disabled:bg-on-surface-disabled group-data-[variant=segmented]:hidden"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
