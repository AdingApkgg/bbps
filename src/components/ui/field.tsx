'use client'

import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-(--hig-cmp-field-set-gap,1.5rem)',
        'has-[>[data-slot=checkbox-group]]:gap-(--hig-cmp-field-set-gap-tight,0.75rem) has-[>[data-slot=radio-group]]:gap-(--hig-cmp-field-set-gap-tight,0.75rem)',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3 font-(--hig-cmp-field-legend-weight,500) text-(--hig-cmp-field-legend-fg,var(--hig-color-on-surface))',
        'data-[variant=legend]:text-(length:--hig-cmp-field-legend-size,1.0625rem)',
        'data-[variant=label]:text-(length:--hig-cmp-field-legend-size-sm,0.9375rem)',
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-(--hig-cmp-field-group-gap,2rem) data-[slot=checkbox-group]:gap-(--hig-cmp-field-group-gap-tight,0.75rem) [&>[data-slot=field-group]]:gap-(--hig-cmp-field-group-gap-nested,1rem)',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'group/field flex w-full min-w-0 gap-(--hig-cmp-field-gap,0.75rem) data-[invalid=true]:text-(--hig-cmp-field-invalid-fg,var(--hig-color-error))',
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
        ],
        responsive: [
          'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto',
          '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
          '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
        ]
      }
    },
    defaultVariants: {
      orientation: 'vertical'
    }
  }
)

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'fieldset'> & VariantProps<typeof fieldVariants>) {
  return (
    <fieldset
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'group/field-content flex flex-1 flex-col gap-(--hig-cmp-field-content-gap,0.5rem) leading-snug',
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-(--hig-cmp-field-label-gap,0.5rem) leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-(--hig-cmp-field-label-box-radius,var(--hig-shape-08)) has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-(--hig-cmp-field-label-box-p,1rem)',
        'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'flex w-fit items-center gap-(--hig-cmp-field-label-gap,0.5rem) text-(length:--hig-cmp-field-title-size,0.9375rem) leading-snug font-(--hig-cmp-field-title-weight,500) text-(--hig-cmp-field-title-fg,var(--hig-color-on-surface)) group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'text-(length:--hig-cmp-field-desc-size,0.9375rem) leading-normal font-normal text-(--hig-cmp-field-desc-fg,var(--hig-color-on-surface-medium)) group-has-[[data-orientation=horizontal]]/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-2',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-(--hig-cmp-field-desc-link-fg,var(--hig-color-primary))',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'relative -my-(--hig-cmp-field-sep-bleed,0.5rem) h-(--hig-cmp-field-sep-h,1.25rem) text-(length:--hig-cmp-field-sep-size,0.9375rem) group-data-[variant=outline]/field-group:-mb-(--hig-cmp-field-sep-bleed,0.5rem)',
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-(--hig-cmp-field-sep-bg,var(--hig-color-surface)) px-2 text-(--hig-cmp-field-sep-fg,var(--hig-color-on-surface-medium))"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()]

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        'text-(length:--hig-cmp-field-error-size,0.9375rem) font-normal text-(--hig-cmp-field-error-fg,var(--hig-color-error))',
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle
}
