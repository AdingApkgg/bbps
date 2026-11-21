'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import * as LabelPrimitive from '@radix-ui/react-label'

/* Label
 *
 * 13px、字重 500、颜色走 on-surface-medium；尺寸与颜色过 `--hig-cmp-label-*` 槽。
 */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-(--hig-cmp-label-gap,0.5rem) text-(length:--hig-cmp-label-size,0.8125rem) leading-none font-(--hig-cmp-label-weight,500) text-(--hig-cmp-label-fg,var(--hig-color-on-surface-medium)) select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
