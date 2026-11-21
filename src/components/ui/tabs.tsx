'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/* Tabs —— 按 iOS 分段控件（segmented control）取形
 *
 * 整条是 `surface-variant-01` 底的滑槽，选中段是 surface-01 实心片 + 一线描边与淡影；
 * 全圆角胶囊容器、内缩 2px 内边距、段间 2px 缝。
 * 所以不需要下划线指示条，也没有底部分隔线。
 * 高度/字重/未选中色都在本文件，`hig.css` 不再复述。
 */
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex w-full items-stretch gap-0.5 overflow-x-auto rounded-sm bg-surface-variant-01',
      'p-0.5 shadow-none',
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
      'inline-flex h-(--hig-size-control-sm) flex-none items-center justify-center gap-2 whitespace-nowrap rounded-08 px-4 text-body-02 text-on-surface-medium',
      'shadow-none transition-[color,background-color,box-shadow] duration-fast-02 ease-standard',
      'hover:bg-state-hover hover:text-on-surface',
      'data-[state=active]:bg-surface-01 data-[state=active]:font-semibold data-[state=active]:text-on-surface',
      'data-[state=active]:shadow-[var(--hig-shadow-hairline),var(--hig-shadow-raised-small)]',
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
