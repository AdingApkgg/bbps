import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* Badge（胶囊 chip）
 *
 * 全圆角胶囊，三档尺寸由 `--md-sys-size-chip-*` 约束，成对的 background / color
 * 令牌保证对比度；assist 形态是 1px 描边 + 透明底。状态用 onSurface 叠加层
 * （hover 加深、pressed 再深一档），不换主色。
 */
const badgeVariants = cva(
  [
    'inline-flex max-w-52 min-w-8 items-center justify-center gap-1 align-middle',
    'rounded-pill px-3 text-title-sm whitespace-nowrap',
    'transition-[background-color,box-shadow,color] duration-fast-02 ease-standard'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-chip-background-blue text-chip-color-blue',
        secondary: 'bg-chip-background-gray text-chip-color-gray',
        /* assist chip：1px 42% 描边、透明底 */
        outline:
          'bg-transparent text-on-surface shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-emphasis-01)]',
        destructive: 'bg-chip-background-red text-chip-color-red',
        green: 'bg-chip-background-green text-chip-color-green',
        teal: 'bg-chip-background-teal text-chip-color-teal',
        magenta: 'bg-chip-background-magenta text-chip-color-magenta',
        purple: 'bg-chip-background-purple text-chip-color-purple',
        cyan: 'bg-chip-background-cyan text-chip-color-cyan',
        'warm-gray': 'bg-chip-background-warm-gray text-chip-color-warm-gray'
      },
      /* 24dp 小记号 / 32dp 标准 chip / 40dp 大 chip */
      size: {
        sm: 'h-(--md-sys-size-chip-sm) px-2 text-caption',
        md: 'h-(--md-sys-size-control-sm)',
        lg: 'h-(--md-sys-size-control-lg) px-4'
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
