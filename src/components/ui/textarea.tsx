import * as React from 'react'
import { cn } from '@/lib/utils'

/* Material Design 2 Text field（filled 多行变体）
 *
 * 与 Input 同一套：填充底、上圆角、只有底部 1px 42% 强调线，聚焦 2px primary。
 * 多行场景不固定高度，最小 3 行；M2 允许纵向拉伸（resize: vertical）。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-24 w-full resize-y rounded-t-sm border-0 bg-field-01 px-4 pt-3 pb-3 text-body-01',
          'text-on-surface caret-on-surface',
          'shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface-placeholder)]',
          'transition-[background-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-on-surface-placeholder',
          'hover:bg-field-hover-01 hover:shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface)]',
          'focus:bg-field-hover-01 focus:shadow-[inset_0_-2px_0_var(--md-sys-color-focus)] focus:outline-none',
          'aria-[invalid=true]:shadow-[inset_0_-2px_0_var(--md-sys-color-error)]',
          'disabled:cursor-not-allowed disabled:bg-surface-disabled-01 disabled:text-on-surface-disabled disabled:shadow-[inset_0_-1px_0_var(--md-sys-color-outline-disabled)]',
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
