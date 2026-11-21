import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* Badge（胶囊 chip）
 *
 * 全圆角胶囊，三档尺寸由 `--hig-size-chip-*` 约束，成对的 background / color
 * 令牌保证对比度；assist 形态是 1px 描边 + 透明底。状态用 onSurface 叠加层
 * （hover 加深、pressed 再深一档），不换主色。
 *
 * 字号取 `text-label`（13px）、不放大写、字距归零、横向 10px 内边距 —— iOS 标记只到这个量级。
 * 外观全在本文件，`hig.css` 的 `.rounded-pill.px-3` 兜底不再复述。
 * 槽位 `--hig-cmp-badge-*`，父级赋值即覆盖。
 */
const badgeVariants = cva(
  [
    'inline-flex max-w-(--hig-cmp-badge-max-w,13rem) min-w-8 items-center justify-center gap-1 align-middle',
    'rounded-(--hig-cmp-badge-radius,var(--hig-shape-max)) px-(--hig-cmp-badge-px,0.75rem) text-label whitespace-nowrap',
    'transition-[background-color,box-shadow,color] duration-fast-02 ease-standard'
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-(--hig-cmp-badge-bg,var(--hig-color-chip-background-blue)) text-(--hig-cmp-badge-fg,var(--hig-color-chip-color-blue))',
        secondary:
          'bg-(--hig-cmp-badge-neutral-bg,var(--hig-color-chip-background-gray)) text-(--hig-cmp-badge-neutral-fg,var(--hig-color-chip-color-gray))',
        /* assist chip：1px 42% 描边、透明底 */
        outline:
          'bg-transparent text-(--hig-cmp-badge-outline-fg,var(--hig-color-label)) shadow-[inset_0_0_0_1px_var(--hig-cmp-badge-outline-border,var(--hig-color-separator-emphasis))]',
        destructive:
          'bg-(--hig-cmp-badge-danger-bg,var(--hig-color-chip-background-red)) text-(--hig-cmp-badge-danger-fg,var(--hig-color-chip-color-red))',
        green:
          'bg-(--hig-cmp-badge-green-bg,var(--hig-color-chip-background-green)) text-(--hig-cmp-badge-green-fg,var(--hig-color-chip-color-green))',
        teal: 'bg-(--hig-cmp-badge-teal-bg,var(--hig-color-chip-background-teal)) text-(--hig-cmp-badge-teal-fg,var(--hig-color-chip-color-teal))',
        magenta:
          'bg-(--hig-cmp-badge-magenta-bg,var(--hig-color-chip-background-magenta)) text-(--hig-cmp-badge-magenta-fg,var(--hig-color-chip-color-magenta))',
        purple:
          'bg-(--hig-cmp-badge-purple-bg,var(--hig-color-chip-background-purple)) text-(--hig-cmp-badge-purple-fg,var(--hig-color-chip-color-purple))',
        cyan: 'bg-(--hig-cmp-badge-cyan-bg,var(--hig-color-chip-background-cyan)) text-(--hig-cmp-badge-cyan-fg,var(--hig-color-chip-color-cyan))',
        'warm-gray':
          'bg-(--hig-cmp-badge-warm-gray-bg,var(--hig-color-chip-background-warm-gray)) text-(--hig-cmp-badge-warm-gray-fg,var(--hig-color-chip-color-warm-gray))'
      },
      /* 24 小记号 / 32 标准 chip / 40 大 chip */
      size: {
        sm: 'h-(--hig-cmp-badge-h-sm,var(--hig-size-chip-sm)) px-(--hig-cmp-badge-px-sm,0.5rem) text-caption',
        md: 'h-(--hig-cmp-badge-h,var(--hig-size-control-sm))',
        lg: 'h-(--hig-cmp-badge-h-lg,var(--hig-size-control-lg)) px-(--hig-cmp-badge-px-lg,1rem)'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
