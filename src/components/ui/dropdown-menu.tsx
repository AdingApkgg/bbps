'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex h-(--hig-size-row) cursor-pointer select-none items-center gap-2 ps-(--hig-cmp-menu-item-ps,1rem) pe-(--hig-cmp-menu-item-pe,0.5rem) text-body-01 outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      'hover:bg-(--hig-cmp-menu-item-bg-hover,var(--hig-color-fill-tertiary)) focus:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-fill-pressed)) data-[state=open]:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-fill-pressed))',
      'data-[disabled]:pointer-events-none data-[disabled]:text-(--hig-color-label-disabled)',
      inset && 'ps-12',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ms-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-(--hig-layer-popover) min-w-(--hig-cmp-menu-min-w,11.5rem) overflow-hidden rounded-(--hig-cmp-menu-radius,var(--hig-shape-08)) border-(length:--hig-size-hairline) border-(--hig-cmp-menu-border,var(--hig-color-separator-01)) bg-(--hig-cmp-menu-bg,var(--hig-color-surface-02)) py-2 text-(--hig-color-label)',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=open]:duration-fast-02 data-[state=closed]:duration-fast-02',
      'data-[state=open]:ease-entrance-expressive data-[state=closed]:ease-exit-expressive',
      'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'relative z-(--hig-layer-popover) max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-(--hig-cmp-menu-min-w,11.5rem) overflow-y-auto overflow-x-hidden rounded-(--hig-cmp-menu-radius,var(--hig-shape-08)) border-(length:--hig-size-hairline) border-(--hig-cmp-menu-border,var(--hig-color-separator-01)) bg-(--hig-cmp-menu-bg,var(--hig-color-surface-02)) py-2 text-(--hig-color-label)',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=open]:duration-fast-02 data-[state=closed]:duration-fast-02',
        'data-[state=open]:ease-entrance-expressive data-[state=closed]:ease-exit-expressive',
        'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex h-(--hig-cmp-menu-item-h,var(--hig-size-row)) cursor-pointer select-none items-center gap-2 ps-(--hig-cmp-menu-item-ps,1rem) pe-(--hig-cmp-menu-item-pe,0.5rem) text-body-01 outline-none transition-colors duration-fast-02 [&>svg]:size-4 [&>svg]:shrink-0',
      'hover:bg-(--hig-cmp-menu-item-bg-hover,var(--hig-color-fill-tertiary)) focus:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-fill-pressed))',
      'data-[disabled]:pointer-events-none data-[disabled]:text-(--hig-color-label-disabled)',
      inset && 'ps-12',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex h-(--hig-cmp-menu-item-h,var(--hig-size-row)) cursor-pointer select-none items-center ps-12 pe-(--hig-cmp-menu-item-pe,0.5rem) text-body-01 outline-none transition-colors duration-fast-02',
      'hover:bg-(--hig-cmp-menu-item-bg-hover,var(--hig-color-fill-tertiary)) focus:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-fill-pressed))',
      'data-[disabled]:pointer-events-none data-[disabled]:text-(--hig-color-label-disabled)',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute start-(--hig-cmp-menu-item-ps,1rem) flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex h-(--hig-cmp-menu-item-h,var(--hig-size-row)) cursor-pointer select-none items-center ps-12 pe-(--hig-cmp-menu-item-pe,0.5rem) text-body-01 outline-none transition-colors duration-fast-02',
      'hover:bg-(--hig-cmp-menu-item-bg-hover,var(--hig-color-fill-tertiary)) focus:bg-(--hig-cmp-menu-item-bg-focus,var(--hig-color-fill-pressed))',
      'data-[disabled]:pointer-events-none data-[disabled]:text-(--hig-color-label-disabled)',
      className
    )}
    {...props}
  >
    <span className="absolute start-(--hig-cmp-menu-item-ps,1rem) flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current focus:size-2" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'flex h-8 items-center px-(--hig-cmp-menu-item-ps,1rem) text-label font-medium text-(--hig-color-label-secondary)',
      inset && 'ps-12',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('h-px bg-(--hig-cmp-menu-separator,var(--hig-color-separator))', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ms-auto text-caption text-(--hig-color-label-secondary)', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
}
