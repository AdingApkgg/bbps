import * as React from 'react'
import { cn } from '@/lib/utils'

/* Text field
 *
 * 填底 + 无边框 + 10px 全圆角，取形按 HIG 的表单字段（`hig.css` 的
 * `input:not([type=checkbox])` 钩子）：
 *  - 底座 field-01，悬停加深一档（field-hover-01），聚焦换 surface-01 并套焦点环；
 *  - 高度取 48px 触达区（`--md-sys-size-field`），不硬凑 M2 带浮动标签的 56dp；
 *  - 组件里保留一条 1px 底衬 / 2px focus 底衬（inset box-shadow，不改边框宽度所以
 *    不挤动内容），在 HIG 钩子之外单独用本组件时也仍有聚焦与 invalid 的可见信号；
 *  - invalid 用 error 底衬 + 错误文案。
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-(--md-sys-size-field) min-h-0 w-full rounded-sm border-0 bg-field-01 px-4 py-0 text-body-01',
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
