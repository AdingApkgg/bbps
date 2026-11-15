import { cn } from '@/lib/utils'

/* Material Design 2 Skeleton
 *
 * M2 的骨架块带 4dp 圆角（文字行给全圆角），用 skeleton 底色 +
 * 一条 1.5s 的横向高光扫过（standard 曲线，linear 会显得生硬）。
 * reduced-motion 时静止。
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton-sweep h-4 w-full rounded-sm', className)} {...props} />
}

export { Skeleton }
