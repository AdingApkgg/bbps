'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

/* 分隔线
 *
 * 横竖两向都走 `bg-outline-01`（HIG 0.5px 分隔线口径），不写在制内用 `bg-outline`。
 * 放在列表容器里时 `hig.css` 的 `[data-list-item]::after` 会另画线，别与本组件叠用。
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    data-slot="separator"
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-outline-01',
      orientation === 'horizontal' ? 'h-[0.5px] w-full' : 'h-full w-[0.5px]',
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
