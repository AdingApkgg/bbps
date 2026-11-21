import * as React from 'react'
import { cn } from '@/lib/utils'

/* Textarea
 *
 * 与 Input 同一套描边 + 填底 + 控件圆角，只是多行：最小 3 行、不固定高度、允许纵向拉伸
 * （resize: vertical）。聚焦环与无效态同 Input，外观全在本文件。
 *
 * 外观过与 Input 同名的 `--hig-cmp-field-*` 槽，父级赋值即覆盖。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-24 w-full resize-y rounded-(--hig-cmp-field-radius,var(--hig-shape-control)) border-(length:--hig-cmp-field-border-width,1px) border-(--hig-cmp-field-border,var(--hig-color-separator-field)) bg-(--hig-cmp-field-bg,var(--hig-color-field)) px-(--hig-cmp-field-px,1rem) pt-3 pb-3 text-body-01',
          'text-(--hig-cmp-field-fg,var(--hig-color-label)) caret-(--hig-color-label)',
          'shadow-none outline-none',
          'transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-(--hig-color-label-quaternary)',
          'hover:border-(--hig-cmp-field-border-hover,var(--hig-color-separator-emphasis)) hover:bg-(--hig-cmp-field-bg-hover,var(--hig-color-field-hover))',
          'focus:border-(--hig-cmp-field-border-focus,var(--hig-color-primary)) focus:bg-(--hig-cmp-field-bg-focus,var(--hig-color-surface-01)) focus:shadow-[0_0_0_3px_var(--hig-color-highlight)] focus:outline-none',
          'aria-[invalid=true]:border-(--hig-cmp-field-border-invalid,var(--hig-color-error))',
          'disabled:cursor-not-allowed disabled:border-(--hig-cmp-field-border-disabled,var(--hig-color-separator-disabled)) disabled:bg-(--hig-cmp-field-bg-disabled,var(--hig-color-fill-disabled)) disabled:text-(--hig-cmp-field-fg-disabled,var(--hig-color-label-disabled))',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
