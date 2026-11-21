import * as React from 'react'
import { cn } from '@/lib/utils'

/* Textarea
 *
 * 与 Input 同一套描边 + 填底 + 控件圆角，只是多行：最小 3 行、不固定高度、允许纵向拉伸
 * （resize: vertical）。聚焦环与无效态同 Input，外观全在本文件。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-24 w-full resize-y rounded-sm border border-outline-field bg-field-01 px-4 pt-3 pb-3 text-body-01',
          'text-on-surface caret-on-surface',
          'shadow-none outline-none',
          'transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-on-surface-placeholder',
          'hover:border-outline-emphasis-01 hover:bg-field-hover-01',
          'focus:border-primary focus:bg-surface-01 focus:shadow-[0_0_0_3px_var(--hig-color-highlight)] focus:outline-none',
          'aria-[invalid=true]:border-error',
          'disabled:cursor-not-allowed disabled:border-outline-disabled disabled:bg-surface-disabled-01 disabled:text-on-surface-disabled',
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
