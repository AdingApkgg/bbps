import * as React from 'react'
import { cn } from '@/lib/utils'

/* 分组区段（原 Card）
 *
 * HIG 的做法不是「卡片」而是「分组区段」：一块控件圆角的容器铺在分组底色上，
 * 行之间 0.5px 缩进分隔线，区段本身零边框、零投影。标题退到容器外的上一行，
 * 13px 次要色，像 iOS「设置」的分组抬头那样。
 *
 * 结构语义保留：`data-slot="card"` 同时是列表容器的钩子（hig.css 的
 * `[data-list-group]`），所以区段内的行自动拿分隔线；单独使用时它就是一个
 * 内容块，不再有边框和影。
 *
 * 外观过 `--hig-cmp-card-*` 槽，父级赋值即覆盖。
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-(--hig-cmp-card-radius,var(--hig-shape-control)) bg-(--hig-cmp-card-bg,var(--hig-color-surface-02))',
        className
      )}
      data-slot="card"
      data-list-group
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-3 px-(--hig-cmp-card-px,1rem) pt-4 pb-2',
        className
      )}
      data-slot="card-header"
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/* 区段标题：13px 次要色，行首缩进与行内容对齐 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-label font-semibold text-(--hig-cmp-card-title-fg,var(--hig-color-label-secondary))',
        className
      )}
      data-slot="card-title"
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-label text-(--hig-cmp-card-desc-fg,var(--hig-color-label-secondary))',
      className
    )}
    data-slot="card-description"
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-(--hig-cmp-card-px,1rem) pb-4', className)}
      data-slot="card-content"
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-3 flex items-center gap-3 text-label', className)}
      data-slot="card-footer"
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

/* 区段内的一行
 *
 * 分隔线与缩进由来 `hig.css` 的 `[data-list-item]::after` 画，所以行本身不写边框；
 * 用法固定为「图标在左、标题/说明两行在左、尾部控件或 chevron 在右」。
 * 可当 `<li>` 用（渲染成 div 时外面要补 `role="listitem"`）。
 */
const CardRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-3 px-(--hig-cmp-card-px,1rem) py-(--hig-cmp-card-row-py,0.75rem) transition-colors duration-fast-02',
        'hover:bg-(--hig-cmp-card-row-bg-hover,var(--hig-color-fill-secondary)) active:bg-(--hig-cmp-card-row-bg-active,var(--hig-color-fill-pressed))',
        className
      )}
      data-list-item
      {...props}
    />
  )
)
CardRow.displayName = 'CardRow'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardRow }
