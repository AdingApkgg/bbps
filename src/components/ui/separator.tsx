'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

/* 分隔线
 *
 * 横竖两向都走 `bg-(--hig-color-separator-01)`（HIG 0.5px 分隔线口径），不写在制内用 `bg-(--hig-color-separator)`。
 * 放在列表容器里时 `hig.css` 的 `[data-list-item]::after` 会另画线，别与本组件叠用。
 * 颜色过 `--hig-cmp-separator` 槽，父级赋值即覆盖。
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
      'shrink-0 bg-(--hig-cmp-separator,var(--hig-color-separator-01))',
      orientation === 'horizontal'
        ? 'h-(--hig-size-hairline) w-full'
        : 'h-full w-(--hig-size-hairline)',
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
