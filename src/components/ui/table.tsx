import * as React from 'react'

import { cn } from '@/lib/utils'

/* Data table
 *
 * 取形按 HIG 的 inset grouped 表格：表格自己就是一块容器（surface-02 底、圆角、横向滚动），
 * 圆角 div，否则底色与圆角叠两层、出现两个滚动盒。
 * 行分隔线与分组列表同一档（0.5px、outline-variant-01），零竖线、零影；
 * 表头不放大写、13px/600、中性色。外观全在本文件，`hig.css` 不再复述。
 *
 * 外观过 `--hig-cmp-table-*` 槽，父级赋值即覆盖。
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      data-slot="table-wrap"
      className="relative w-full overflow-auto rounded-(--hig-cmp-table-radius,var(--hig-shape-control)) border-(length:--hig-size-hairline) border-(--hig-cmp-table-border,var(--hig-color-separator-01)) bg-(--hig-cmp-table-bg,var(--hig-color-surface-02))"
    >
      <table
        ref={ref}
        className={cn('w-full border-collapse text-start text-body-02', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-0', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tbody ref={ref} className={cn(className)} {...props} />)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-(--hig-color-fill-subtle) font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        'border-b-(length:--hig-size-hairline) border-(--hig-cmp-table-row-border,var(--hig-color-separator-variant)) transition-colors duration-fast-02',
        'last:border-b-0 hover:bg-(--hig-cmp-table-row-bg-hover,var(--hig-color-fill-secondary)) data-[state=selected]:bg-(--hig-cmp-table-row-bg-selected,var(--hig-color-fill-selected-solid))',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-(--hig-cmp-table-row-h,3.25rem) bg-(--hig-cmp-table-head-bg,var(--hig-color-fill-subtle)) px-(--hig-cmp-table-cell-px,1rem) text-start align-middle text-label font-semibold text-(--hig-cmp-table-head-fg,var(--hig-color-label-secondary)) tracking-normal',
      '[&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'h-(--hig-cmp-table-row-h,3.25rem) px-(--hig-cmp-table-cell-px,1rem) align-middle',
      '[&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4 text-caption text-(--hig-cmp-table-caption-fg,var(--hig-color-label-secondary))',
      className
    )}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
