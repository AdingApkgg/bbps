import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/* Button
 *
 * 形状与字号按 HIG（17px/600、10px 圆角、48px 高）：HIG 的按钮是平的，零影零抬升，
 * 状态只改底色或叠一层极淡的 state 层，不靠投影。
 *  - 状态靠合成好的 `bg-*-hover` / `bg-*-active` 表达，不是改主色；
 *  - 所有变体都无影；
 *  - focus 走 `:focus-visible` 全局 3px 环（`hig.css`，层内低于 utilities）；
 *  - 切换型按钮（`aria-pressed`）用 2px 内描边 + link 色表示已按下。
 *
 * M2 的「拉丁大写 + 0.089em 字距」由 `hig.css` 的 `:root .text-button` 压掉。
 * 一屏只留一个 default(filled primary)。
 */
const buttonVariants = cva(
  [
    'relative inline-flex max-w-80 shrink-0 items-center justify-center gap-2 whitespace-nowrap',
    'overflow-hidden rounded-sm border-0 font-semibold',
    'text-button no-underline select-none',
    'transition-[background-color,box-shadow,color] duration-fast-02 ease-standard',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'aria-pressed:shadow-[inset_0_0_0_2px_var(--md-sys-color-link)] aria-pressed:text-link',
    '[&_svg]:pointer-events-none [&_svg]:size-[1.125rem] [&_svg]:shrink-0'
  ].join(' '),
  {
    variants: {
      variant: {
        /* contained：唯一的实心主色按钮 */
        default: [
          'bg-button-contained text-on-button-contained',
          'hover:enabled:bg-button-contained-hover',
          'active:enabled:bg-button-contained-active',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        /* 中性容器色的次级填充按钮，文字用 primary */
        secondary: [
          'bg-button-outlined text-on-button-outlined',
          'hover:enabled:bg-button-outlined-hover',
          'active:enabled:bg-button-outlined-active',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        /* bordered：42% 描边，无底，hover 叠 4% primary */
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
          'bg-button-contained-error text-on-primary',
          'hover:enabled:bg-button-error-hover',
          'active:enabled:bg-button-error-active',
          'disabled:bg-button-contained-disabled disabled:text-on-surface-disabled'
        ].join(' '),
        link: 'h-auto border-0 bg-transparent p-0 normal-case tracking-normal text-link hover:enabled:text-link-hover hover:enabled:underline'
      },
      /* 高度档位接令牌：改 --md-sys-size-lg 即整体缩放；图标按钮是 48px 触达区 */
      size: {
        xs: 'h-(--md-sys-size-control-xs) px-2 text-caption',
        sm: 'h-(--md-sys-size-control-sm) px-3',
        default: 'h-(--md-sys-size-control) px-4',
        lg: 'h-(--md-sys-size-control-lg) px-6',
        xl: 'h-(--md-sys-size-control-xl) px-8',
        icon: 'size-(--md-sys-size-control-xl) p-0',
        'icon-sm': 'size-(--md-sys-size-control) p-0',
        'icon-lg': 'size-(--md-sys-size-control-2xl) p-0'
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
      <Comp
        data-slot="button"
        data-variant={variant ?? 'default'}
        data-size={size ?? 'default'}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
