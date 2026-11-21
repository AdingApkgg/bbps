'use client'

import type * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Checkbox
 *
 * Radix 承载语义（40px 触达圆上的状态层、Space 切换、indeterminate）。
 * 形状按 HIG：19×19、8px 圆角、1.5px 描边；选中与半选是 success 绿实心 + 白勾。
 *
 * 外观是**单一来源**，只在本文件：`hig.css` 里不再有 [data-slot="checkbox"] 规则。
 * 未选框底必须是不透明的 surface-01，半透明会让下面的分隔线透上来。
 *
 * 勾用 lucide 的 Check/Minus，尺寸 14 保证在 19px 框里留内边距。
 *
 * 外观过 `--hig-cmp-checkbox-*` 槽，父级赋值即覆盖。
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'group peer relative inline-flex size-(--hig-cmp-checkbox-size,1.1875rem) shrink-0 items-center justify-center rounded-(--hig-cmp-checkbox-radius,var(--hig-shape-08))',
        'border-(length:--hig-cmp-checkbox-border-width,var(--hig-size-border-thin)) border-(--hig-cmp-checkbox-border,var(--hig-color-separator-01)) bg-(--hig-cmp-checkbox-bg,var(--hig-color-surface-01))',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-(--hig-size-hit-halo) before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-(--hig-color-label)/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--hig-color-focus)',
        'focus-visible:before:bg-(--hig-color-primary)/12',
        'active:enabled:before:bg-(--hig-color-primary)/12',
        'data-[state=checked]:border-(--hig-cmp-checkbox-checked-bg,var(--hig-color-success)) data-[state=checked]:bg-(--hig-cmp-checkbox-checked-bg,var(--hig-color-success))',
        'data-[state=indeterminate]:border-(--hig-cmp-checkbox-checked-bg,var(--hig-color-success)) data-[state=indeterminate]:bg-(--hig-cmp-checkbox-checked-bg,var(--hig-color-success))',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:border-(--hig-color-label-disabled)',
        'disabled:data-[state=checked]:border-transparent disabled:data-[state=checked]:bg-(--hig-color-label-disabled)/38',
        'disabled:data-[state=indeterminate]:border-transparent disabled:data-[state=indeterminate]:bg-(--hig-color-label-disabled)/38',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-(--hig-cmp-checkbox-mark,var(--hig-color-on-button-filled))"
      >
        <Check
          aria-hidden
          className="size-3.5 group-data-[state=indeterminate]:hidden"
          strokeWidth={3}
        />
        <Minus
          aria-hidden
          className="hidden size-3.5 group-data-[state=indeterminate]:block"
          strokeWidth={3}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
