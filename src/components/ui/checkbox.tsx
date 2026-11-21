'use client'

import type * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Checkbox
 *
 * Radix 承载语义（40px 触达圆上的状态层、Space 切换、indeterminate）。
 * 形状按 HIG：19×19、8px 圆角、1.5px 描边；选中与半选是 success 绿实心 + 白勾。
 * 外观全在本文件，`hig.css` 不再复述。
 *
 * 勾用 lucide 的 Check/Minus，尺寸 14 保证在 19px 框里留内边距。
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'group peer relative inline-flex size-[1.1875rem] shrink-0 items-center justify-center rounded-08',
        'border-(--hig-size-border-thin) border-outline-01 bg-transparent',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-(--hig-size-hit-halo) before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'data-[state=checked]:border-success data-[state=checked]:bg-success',
        'data-[state=indeterminate]:border-success data-[state=indeterminate]:bg-success',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:border-on-surface-disabled',
        'disabled:data-[state=checked]:border-transparent disabled:data-[state=checked]:bg-on-surface-disabled/38',
        'disabled:data-[state=indeterminate]:border-transparent disabled:data-[state=indeterminate]:bg-on-surface-disabled/38',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-on-button-contained"
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
