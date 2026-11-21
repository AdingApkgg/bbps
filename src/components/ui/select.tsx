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
      'flex h-(--hig-cmp-field-h,var(--hig-size-field)) w-full cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-(--hig-cmp-field-radius,var(--hig-shape-control)) border-(length:--hig-cmp-field-border-width,1px) border-(--hig-cmp-field-border,var(--hig-color-outline-field)) bg-(--hig-cmp-field-bg,var(--hig-color-field-01)) py-0 pl-(--hig-cmp-field-px,1rem) pr-3 text-body-01 text-(--hig-cmp-field-fg,var(--hig-color-on-surface))',
      'shadow-none',
      'transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard hover:border-(--hig-cmp-field-border-hover,var(--hig-color-outline-emphasis-01)) hover:bg-(--hig-cmp-field-bg-hover,var(--hig-color-field-hover-01))',
      // 聚焦是「换白底 + 3.5px tint 环」，不是换描边色；`:focus` 与 `:focus-visible` 都接，
      // 否则鼠标点进去没有环、键盘用户又有环，两套外观
      'focus:border-(--hig-cmp-field-border-focus,var(--hig-color-primary)) focus:bg-(--hig-cmp-field-bg-focus,var(--hig-color-surface-01)) focus:shadow-[0_0_0_3.5px_var(--hig-color-highlight)] focus:outline-none',
      'focus-visible:border-(--hig-cmp-field-border-focus,var(--hig-color-primary)) focus-visible:bg-(--hig-cmp-field-bg-focus,var(--hig-color-surface-01)) focus-visible:shadow-[0_0_0_3.5px_var(--hig-color-highlight)] focus-visible:outline-none',
      'data-[state=open]:border-(--hig-cmp-field-border-focus,var(--hig-color-primary)) data-[state=open]:bg-(--hig-cmp-field-bg-focus,var(--hig-color-surface-01)) data-[state=open]:shadow-[0_0_0_3.5px_var(--hig-color-highlight)]',
      'disabled:cursor-not-allowed disabled:border-(--hig-cmp-field-border-disabled,var(--hig-color-outline-disabled)) disabled:bg-(--hig-cmp-field-bg-disabled,var(--hig-color-surface-disabled-01)) disabled:text-(--hig-cmp-field-fg-disabled,var(--hig-color-on-surface-disabled))',
      'aria-[invalid=true]:border-(--hig-cmp-field-border-invalid,var(--hig-color-error))',
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
    className={cn(
      'flex h-8 cursor-default items-center justify-center bg-material-sheet backdrop-blur-[20px]',
      className
    )}
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
    className={cn(
      'flex h-8 cursor-default items-center justify-center bg-material-sheet backdrop-blur-[20px]',
      className
    )}
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
        // 菜单浮层：材质底（半透明 + 模糊）、0.5px 发丝边；单层淡影 + 短淡入，位移只有 2px
        'rounded-(--hig-cmp-popover-radius,var(--hig-shape-08)) border-(length:--hig-size-hairline) border-(--hig-cmp-popover-border,var(--hig-color-outline-01)) bg-(--hig-cmp-popover-bg,var(--hig-color-material-sheet)) backdrop-blur-(--hig-cmp-popover-blur,20px) backdrop-saturate-[180%]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:duration-fast-02 data-[state=closed]:duration-fast-02',
        'data-[state=open]:ease-entrance data-[state=closed]:ease-exit',
        'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-0.5 data-[side=top]:-translate-y-0.5',
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
      'relative flex h-(--hig-cmp-menu-item-h,var(--hig-size-row)) w-full cursor-pointer select-none items-center ps-(--hig-cmp-menu-item-px,1rem) pe-8 text-body-01',
      'transition-colors duration-fast-02 ease-standard',
      'hover:bg-(--hig-cmp-menu-item-bg-hover,var(--hig-color-surface-hover-02)) focus:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-state-pressed))',
      'data-[state=checked]:bg-(--hig-cmp-menu-item-bg-checked,var(--hig-color-surface-selected-02)) data-[state=checked]:font-medium',
      'data-[disabled]:pointer-events-none data-[disabled]:text-on-surface-disabled',
      className
    )}
    {...props}
  >
    <span className="absolute end-(--hig-cmp-menu-item-indicator-inset,0.5rem) flex h-3.5 w-3.5 items-center justify-center">
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
    className={cn('h-px bg-(--hig-cmp-menu-separator,var(--hig-color-outline))', className)}
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
