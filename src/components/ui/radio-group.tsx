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
 *
 * 槽位 `--hig-cmp-radio-*`、`--hig-cmp-segmented-*`，父级赋值即覆盖。
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
          'inline-flex w-fit items-stretch gap-0.5 rounded-(--hig-cmp-segmented-radius,var(--hig-shape-control)) bg-(--hig-cmp-segmented-track-bg,var(--hig-color-fill-subtle)) p-0.5',
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
        'peer relative inline-flex size-(--hig-cmp-radio-size,1.25rem) shrink-0 items-center justify-center gap-2 rounded-full',
        'border-(length:--hig-cmp-radio-border-width,var(--hig-size-border-thin)) border-(--hig-cmp-radio-border,var(--hig-color-separator-01)) bg-transparent',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-(--hig-size-hit-halo) before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-(--hig-color-label)/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hig-color-focus)',
        'focus-visible:before:bg-(--hig-color-primary)/12',
        'active:enabled:before:bg-(--hig-color-primary)/12',
        'data-[state=checked]:border-(--hig-cmp-radio-border-checked,var(--hig-color-primary))',
        'disabled:cursor-not-allowed disabled:opacity-45',
        // 分段按钮形态：2rem 高、8px 圆角、选中抬起的面
        'group-data-[variant=segmented]:h-(--hig-cmp-segmented-h,2rem) group-data-[variant=segmented]:w-auto',
        'group-data-[variant=segmented]:rounded-(--hig-cmp-segmented-item-radius,var(--hig-shape-08)) group-data-[variant=segmented]:border-0 group-data-[variant=segmented]:shadow-none',
        'group-data-[variant=segmented]:px-(--hig-cmp-segmented-px,1rem) group-data-[variant=segmented]:py-2',
        'group-data-[variant=segmented]:text-body-02 group-data-[variant=segmented]:font-medium',
        'group-data-[variant=segmented]:gap-0',
        'group-data-[variant=segmented]:before:hidden',
        'group-data-[variant=segmented]:text-(--hig-color-label-secondary)',
        'group-data-[variant=segmented]:hover:enabled:text-(--hig-color-label)',
        'group-data-[variant=segmented]:data-[state=checked]:bg-(--hig-cmp-segmented-item-bg-checked,var(--hig-color-surface-01))',
        'group-data-[variant=segmented]:data-[state=checked]:font-semibold',
        'group-data-[variant=segmented]:data-[state=checked]:text-(--hig-color-label)',
        'group-data-[variant=segmented]:data-[state=checked]:shadow-[var(--hig-shadow-hairline),var(--hig-shadow-raised-small)]',
        className
      )}
      {...props}
    >
      {children}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="block size-2 rounded-full bg-(--hig-cmp-radio-dot,var(--hig-color-primary)) peer-disabled:bg-(--hig-color-label-disabled) group-data-[variant=segmented]:hidden"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
