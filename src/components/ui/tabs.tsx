'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/* Material Design 2 Tabs（fixed，指示条在下方）
 *
 * M2 的页签是 48dp 高、button 排版（14sp/500/大写 1.25px）、60% 文字色，
 * 选中项转 primary 满不透明；指示条是 primary 2dp，用 inset 阴影画所以不改高。
 * 未选中项没有下划线，hover 只叠 4% primary 状态层。
 */
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex w-full items-stretch overflow-x-auto bg-surface-01 shadow-[inset_0_-1px_0_0_var(--md-sys-color-outline-01)]',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex h-12 flex-none items-center justify-center gap-2 whitespace-nowrap px-4 text-button text-on-surface-medium uppercase',
      'transition-[color,background-color,box-shadow] duration-fast-02 ease-standard',
      'hover:bg-state-hover hover:text-link',
      'data-[state=active]:text-link data-[state=active]:shadow-[inset_0_-2px_0_0_var(--md-sys-color-interactive)]',
      'data-[state=active]:hover:bg-state-hover',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      'disabled:pointer-events-none disabled:text-on-surface-disabled',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
