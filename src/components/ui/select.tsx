'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      'flex h-12 w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-t-sm border-0 bg-field-01 py-0 pl-4 pr-3 text-body-01 text-on-surface',
      'shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface-placeholder)]',
      'transition-[background-color,box-shadow] duration-fast-02 ease-standard hover:bg-field-hover-01 hover:shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface)]',
      'focus:bg-field-hover-01 focus:shadow-[inset_0_-2px_0_var(--md-sys-color-focus)] focus:outline-none',
      'data-[state=open]:bg-field-hover-01 data-[state=open]:shadow-[inset_0_-2px_0_var(--md-sys-color-focus)]',
      'disabled:cursor-not-allowed disabled:bg-surface-disabled-01 disabled:text-on-surface-disabled disabled:shadow-[inset_0_-1px_0_var(--md-sys-color-outline-disabled)]',
      'aria-[invalid=true]:shadow-[inset_0_-2px_0_var(--md-sys-color-error)]',
      '[&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex h-8 cursor-default items-center justify-center bg-surface-02', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex h-8 cursor-default items-center justify-center bg-surface-02', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm bg-surface-02 py-2 text-on-surface shadow-scrim',
        // M2 菜单浮层：8dp 影 + short-2 淡入，位移只有 2dp
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:duration-fast-02 data-[state=closed]:duration-fast-02',
        'data-[state=open]:ease-entrance data-[state=closed]:ease-exit',
        'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
        position === 'popper' && 'data-[side=bottom]:translate-y-0.5 data-[side=top]:-translate-y-0.5',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'py-0',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-4 py-2 text-label text-on-surface-medium', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex h-12 w-full cursor-pointer select-none items-center pl-4 pr-8 text-body-01',
      'transition-colors duration-fast-02 ease-standard',
      'hover:bg-surface-hover-02 focus:bg-state-pressed',
      'data-[state=checked]:bg-surface-selected-02 data-[state=checked]:font-medium',
      'data-[disabled]:pointer-events-none data-[disabled]:text-on-surface-disabled',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('h-px bg-outline', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
}
