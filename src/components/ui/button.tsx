import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* Material Design 2 Button
 *
 * 规格取自 m2.material.io/components/buttons 与 material-components-web 的
 * button/_variables.scss：
 *  - contained 按钮高 36dp、radius 4dp、elevation 1→2→4dp（hover/active 升高）；
 *  - 标签大写 + 0.089em 字距（14px × 0.089 ≈ 1.25px），字重 500；
 *  - text / outlined 按钮无影，状态靠 onSurface / primary 的状态层叠加
 *    （hover 4%、focus 12%、pressed 12%），不是换色；
 *  - 触达区不小于 48dp（--md-sys-size-touch-target），因此按钮外沿留出足够间距；
 *  - focus 是 2px primary 描边 + 外扩 2px，与全站 :focus-visible 同款。
 *
 * 这里用 bg-*-hover / bg-*-active 表达状态层（已按 M2 透明度预合成为实色）。
 * 一屏只留一个 default(contained primary)。
 */
const buttonVariants = cva(
  [
    'relative inline-flex max-w-80 shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'overflow-hidden rounded-sm border-0 font-medium uppercase',
    'text-button no-underline select-none',
    'transition-[background-color,box-shadow,color] duration-fast-02 ease-standard',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none',
    '[&_svg]:pointer-events-none [&_svg]:size-[1.125rem] [&_svg]:shrink-0'
  ].join(' '),
  {
    variants: {
      variant: {
        /* contained：唯一的实心主色按钮，带 elevation */
        default: [
          'bg-button-contained text-on-button-contained shadow-sm',
          'hover:enabled:bg-button-contained-hover hover:enabled:shadow',
          'active:enabled:bg-button-contained-active active:enabled:shadow-md',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        /* contained secondary：中性容器色，文字用 primary */
        secondary: [
          'bg-button-outlined text-on-button-outlined shadow-sm',
          'hover:enabled:bg-button-outlined-hover hover:enabled:shadow',
          'active:enabled:bg-button-outlined-active active:enabled:shadow-md',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        /* outlined：1px 42% 描边，无影，hover 加 4% primary 底 */
        outline: [
          'border border-outline-emphasis bg-transparent text-link',
          'hover:enabled:bg-state-hover',
          'active:enabled:bg-state-selected',
          'disabled:border-outline-disabled disabled:bg-transparent disabled:text-on-surface-disabled'
        ].join(' '),
        /* text：无底无边，hover 叠 4% primary */
        ghost: [
          'bg-transparent text-link',
          'hover:enabled:bg-state-hover',
          'active:enabled:bg-state-selected',
          'disabled:bg-transparent disabled:text-on-surface-disabled'
        ].join(' '),
        /* contained destructive */
        destructive: [
          'bg-button-contained-error text-on-primary shadow-sm',
          'hover:enabled:bg-button-error-hover hover:enabled:shadow',
          'active:enabled:bg-button-error-active active:enabled:shadow-md',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        link: 'h-auto border-0 bg-transparent p-0 normal-case tracking-normal text-link hover:enabled:text-link-hover hover:enabled:underline'
      },
      /* M2 高度：small 32dp / default 36dp / large 40dp；图标按钮是 48dp 触达区 */
      size: {
        xs: 'h-7 px-2 text-caption',
        sm: 'h-8 px-3',
        default: 'h-9 px-4',
        lg: 'h-10 px-6',
        xl: 'h-12 px-8',
        icon: 'size-12 p-0',
        'icon-sm': 'size-9 p-0',
        'icon-lg': 'size-14 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
