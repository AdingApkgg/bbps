import { cn } from '@/lib/utils'

/* Skeleton
 *
 * 骨架块用 skeleton 底 + 一条 1.5s 横向高光扫过（standard 曲线，linear 显得生硬），
 * reduced-motion 时静止。圆角 8px 由 `hig.css` 的 `[data-slot="skeleton"]` 钩子给，
 * 文字行调用方再叠 `rounded-full`。
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('skeleton-sweep h-4 w-full rounded-sm', className)}
      {...props}
    />
  )
}

export { Skeleton }
