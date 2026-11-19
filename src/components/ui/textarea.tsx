import * as React from 'react'
import { cn } from '@/lib/utils'

/* Textarea
 *
 * 与 Input 同一套填底 + 全圆角，只是多行：最小 3 行、不固定高度、允许纵向拉伸
 * （resize: vertical）。聚焦环与无效态同 Input，样式主体由 `hig.css` 的
 * `textarea` 钩子接管。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-24 w-full resize-y rounded-sm border-0 bg-field-01 px-4 pt-3 pb-3 text-body-01',
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
