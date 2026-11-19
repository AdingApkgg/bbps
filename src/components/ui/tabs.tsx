'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/* Tabs —— 按 iOS 分段控件（segmented control）取形
 *
 * `hig.css` 把 `[role='tablist']` 画成一块 `field-01` 底的可滑分段：整条 10px 圆角、
 * 选中段是实白血块加一线描边。所以这里不再需要 M2 的下划线指示条，
 * 高度/字重/未选中色都在样式表里统一，组件只管语义。
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
      'inline-flex h-(--md-sys-size-control-sm) flex-none items-center justify-center gap-2 whitespace-nowrap px-4 text-body-02 text-on-surface-medium',
      'transition-[color,background-color,box-shadow] duration-fast-02 ease-standard',
      'hover:bg-state-hover hover:text-on-surface',
      'data-[state=active]:text-on-surface',
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
