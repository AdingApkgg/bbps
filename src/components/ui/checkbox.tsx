'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

/* Material Design 2 Checkbox
 *
 * 规格取自 m2.material.io/components/checkboxes 与 material-components-web 的
 * checkbox/_variables.scss：
 *  - 方框 18×18、radius 2dp、2dp 边框；
 *  - 未选中边框 = onSurface 54%（on-surface-medium），选中 = primary 实心 + 白勾；
 *  - indeterminate 同样是选中态，内容换成横线；
 *  - 状态层叠在 40dp 触达圆上（比方框每边多 11dp）：hover 4%、focus 12%、pressed 12%；
 *  - focus 是 2px primary 描边，外扩 2px。
 *
 * 勾用 lucide 的 Check/Minus，尺寸 14 保证在 18dp 框里留 2dp 内边距。
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'group peer relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-[2px]',
        'border-2 border-on-surface-medium bg-transparent',
        'transition-colors duration-fast-01 ease-standard',
        'before:absolute before:-inset-[11px] before:rounded-full before:content-[""]',
        'before:transition-colors before:duration-fast-01 before:ease-standard',
        'hover:enabled:before:bg-on-surface/4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'focus-visible:before:bg-primary/12',
        'active:enabled:before:bg-primary/12',
        'data-[state=checked]:border-outline-active data-[state=checked]:bg-primary',
        'data-[state=indeterminate]:border-outline-active data-[state=indeterminate]:bg-primary',
        'disabled:cursor-not-allowed disabled:border-on-surface-disabled',
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
        <Check aria-hidden className="size-3.5 group-data-[state=indeterminate]:hidden" strokeWidth={3} />
        <Minus aria-hidden className="hidden size-3.5 group-data-[state=indeterminate]:block" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
