import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-(--hig-cmp-alert-radius,var(--hig-shape-control)) border-(length:--hig-cmp-alert-border-width,1px)) border-(--hig-cmp-alert-border,var(--hig-color-outline-01)) px-(--hig-cmp-alert-px,1rem) py-(--hig-cmp-alert-py,0.75rem) text-body-02 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-(--hig-cmp-alert-icon,1rem) [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default:
          'bg-(--hig-cmp-alert-bg,var(--hig-color-surface-02)) text-(--hig-cmp-alert-fg,var(--hig-color-on-surface))',
        destructive:
          'bg-(--hig-cmp-alert-danger-bg,var(--hig-color-surface-02)) text-(--hig-cmp-alert-danger-fg,var(--hig-color-error)) border-(--hig-cmp-alert-danger-border,var(--hig-color-error)) *:data-[slot=alert-description]:text-(--hig-cmp-alert-danger-fg,var(--hig-color-error))/90 [&>svg]:text-current'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-semibold text-body-02', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-body-02 text-(--hig-cmp-alert-desc-fg,var(--hig-color-on-surface-medium)) [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
