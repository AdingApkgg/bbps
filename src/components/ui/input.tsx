import * as React from 'react'
import { cn } from '@/lib/utils'

/* Material Design 2 Text field（filled 变体）
 *
 * M2 的输入框是「填充底 + 只有上圆角 + 底部 42% 强调线」：
 *  - 底座 field-01（onSurface 4%），上圆角 4dp，只有底部 1px rgba(0,0,0,.42)；
 *  - 聚焦时底部强调线加粗到 2px 并变 primary —— 用 inset box-shadow 而不是改
 *    边框宽度，所以不会挤动内容；光标同步 primary；
 *  - 悬停把底座加深一档（状态层 4%）；
 *  - 高度：M2 的 56dp 里含浮动标签区，本站输入框没有浮动标签，因此取 48dp
 *    触达区高度（--md-sys-size-touch-target），不硬凑 56。
 *  - invalid 用 error 色强调线 + 错误文案。
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 min-h-0 w-full rounded-t-sm border-0 bg-field-01 px-4 py-0 text-body-01',
          'text-on-surface caret-on-surface',
          'outline-none',
          'shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface-placeholder)]',
          'transition-[background-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-on-surface-placeholder',
          'hover:bg-field-hover-01 hover:shadow-[inset_0_-1px_0_var(--md-sys-color-on-surface)]',
          'focus:bg-field-hover-01 focus:shadow-[inset_0_-2px_0_var(--md-sys-color-focus)] focus:outline-none',
          'aria-[invalid=true]:shadow-[inset_0_-2px_0_var(--md-sys-color-error)]',
          'disabled:cursor-not-allowed disabled:bg-surface-disabled-01 disabled:text-on-surface-disabled disabled:shadow-[inset_0_-1px_0_var(--md-sys-color-outline-disabled)]',
          'file:border-0 file:bg-transparent file:text-body-02',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
