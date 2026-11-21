import * as React from 'react'
import { cn } from '@/lib/utils'

/* Text field
 *
 * 填底 + 无边框 + 10px 全圆角，取形按 HIG 的表单字段：
 *  - 底座 field-01，悬停加深一档（field-hover-01），聚焦换 surface-01 并套 3px 焦点环；
 *  - 高度取 48px 触达区（`--hig-size-field`），不做浮动标签；
 *  - 外观全在本文件，`hig.css` 不再复述字段样式；
 *  - invalid 用 error 描边 + 错误文案。
 *
 * 外观过 `--hig-cmp-field-*` 槽（Input/Textarea/Select 共用），父级赋值即覆盖。
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          /* 字段必须一眼看得出能输入：实底 + 1px 可见描边（不是透明边 + 纯底色差） */
          'flex h-(--hig-cmp-field-h,var(--hig-size-field)) min-h-0 w-full rounded-(--hig-cmp-field-radius,var(--hig-shape-control)) border-(length:--hig-cmp-field-border-width,1px) border-(--hig-cmp-field-border,var(--hig-color-outline-field)) bg-(--hig-cmp-field-bg,var(--hig-color-field-01)) px-(--hig-cmp-field-px,1rem) py-0 text-body-01',
          'text-(--hig-cmp-field-fg,var(--hig-color-on-surface)) caret-on-surface',
          'shadow-none outline-none',
          'transition-[background-color,border-color,box-shadow] duration-fast-02 ease-standard',
          'placeholder:text-on-surface-placeholder',
          'hover:border-(--hig-cmp-field-border-hover,var(--hig-color-outline-emphasis-01)) hover:bg-(--hig-cmp-field-bg-hover,var(--hig-color-field-hover-01))',
          'focus:border-(--hig-cmp-field-border-focus,var(--hig-color-primary)) focus:bg-(--hig-cmp-field-bg-focus,var(--hig-color-surface-01)) focus:shadow-[0_0_0_3px_var(--hig-color-highlight)] focus:outline-none',
          'aria-[invalid=true]:border-(--hig-cmp-field-border-invalid,var(--hig-color-error))',
          'disabled:cursor-not-allowed disabled:border-(--hig-cmp-field-border-disabled,var(--hig-color-outline-disabled)) disabled:bg-(--hig-cmp-field-bg-disabled,var(--hig-color-surface-disabled-01)) disabled:text-(--hig-cmp-field-fg-disabled,var(--hig-color-on-surface-disabled))',
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
