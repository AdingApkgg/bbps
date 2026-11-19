import * as React from 'react'
import { cn } from '@/lib/utils'

/* Text field
 *
 * 填底 + 无边框 + 10px 全圆角，取形按 HIG 的表单字段：
 *  - 底座 field-01，悬停加深一档（field-hover-01），聚焦换 surface-01 并套 3px 焦点环；
 *  - 高度取 48px 触达区（`--md-sys-size-field`），不硬凑 M2 带浮动标签的 56dp；
 *  - 外观全在本文件，`hig.css` 不再复述字段样式；
 *  - invalid 用 error 描边 + 错误文案。
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          /* 字段必须一眼看得出能输入：实底 + 1px 可见描边（不是透明边 + 纯底色差） */
          'flex h-(--md-sys-size-field) min-h-0 w-full rounded-sm border border-outline-field bg-field-01 px-4 py-0 text-body-01',
          'text-on-surface caret-on-surface',
          'shadow-none outline-none',
          'transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-on-surface-placeholder',
          'hover:border-outline-emphasis-01 hover:bg-field-hover-01',
          'focus:border-primary focus:bg-surface-01 focus:shadow-[0_0_0_3px_var(--md-sys-color-highlight)] focus:outline-none',
          'aria-[invalid=true]:border-error',
          'disabled:cursor-not-allowed disabled:border-outline-disabled disabled:bg-surface-disabled-01 disabled:text-on-surface-disabled',
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
