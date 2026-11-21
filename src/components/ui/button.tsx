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
 * 组件里若直写了「拉丁大写 + 0.089em 字距」，由 `hig.css` 的 `:root .text-button` 压掉。
 * 一屏只留一个 default(filled primary)。
 *
 * 所有外观都过 `--hig-cmp-button-*` 槽，父级（或 `hig.css` 里更靠外的作用域）赋值即覆盖，
 * 不赋值就落到写死的兜底值上。
 */
const buttonVariants = cva(
  [
    'relative inline-flex max-w-(--hig-cmp-button-max-w,20rem) shrink-0 items-center justify-center gap-(--hig-cmp-button-gap,0.5rem) whitespace-nowrap',
    'overflow-hidden rounded-(--hig-cmp-button-radius,var(--hig-shape-control)) border-0 font-semibold',
    'text-(length:--hig-cmp-button-font-size,1.0625rem) font-(--hig-cmp-button-font-weight,600) leading-(--hig-cmp-button-line-height,1.2941) tracking-(--hig-cmp-button-tracking,-0.011em) no-underline select-none',
    'transition-[background-color,box-shadow,color] duration-fast-02 ease-standard',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'aria-pressed:shadow-[inset_0_0_0_2px_var(--hig-color-link)] aria-pressed:text-(--hig-color-link)',
    '[&_svg]:pointer-events-none [&_svg]:size-(--hig-cmp-button-icon,1.125rem) [&_svg]:shrink-0'
  ].join(' '),
  {
    variants: {
      variant: {
        /* filled：唯一的实心主色按钮 */
        default: [
          'bg-(--hig-cmp-button-filled-bg,var(--hig-color-button-filled)) text-(--hig-cmp-button-filled-fg,var(--hig-color-on-button-filled))',
          'hover:enabled:bg-(--hig-cmp-button-filled-bg-hover,var(--hig-color-button-filled-hover))',
          'active:enabled:bg-(--hig-cmp-button-filled-bg-active,var(--hig-color-button-filled-active))',
          'disabled:bg-(--hig-cmp-button-disabled-bg,var(--hig-color-button-filled-disabled)) disabled:text-(--hig-cmp-button-disabled-fg,var(--hig-color-label-disabled))'
        ].join(' '),
        /* 中性容器色的次级填充按钮，文字用 primary */
        secondary: [
          'bg-(--hig-cmp-button-tonal-bg,var(--hig-color-button-tonal)) text-(--hig-cmp-button-tonal-fg,var(--hig-color-on-button-tonal))',
          'hover:enabled:bg-(--hig-cmp-button-tonal-bg-hover,var(--hig-color-button-tonal-hover))',
          'active:enabled:bg-(--hig-cmp-button-tonal-bg-active,var(--hig-color-button-tonal-active))',
          'disabled:bg-(--hig-cmp-button-disabled-bg,var(--hig-color-button-filled-disabled)) disabled:text-(--hig-cmp-button-disabled-fg,var(--hig-color-label-disabled))'
        ].join(' '),
        /* bordered：42% 描边，无底，hover 叠 4% primary */
        outline: [
          'border-(length:--hig-cmp-button-outline-width,1px) border-(--hig-cmp-button-outline-color,var(--hig-color-separator-emphasis)) bg-transparent text-(--hig-cmp-button-outline-fg,var(--hig-color-link))',
          'hover:enabled:bg-(--hig-cmp-button-outline-bg-hover,var(--hig-color-fill-hover))',
          'active:enabled:bg-(--hig-cmp-button-outline-bg-active,var(--hig-color-fill-selected))',
          'disabled:border-(--hig-cmp-button-disabled-border,var(--hig-color-separator-disabled)) disabled:bg-transparent disabled:text-(--hig-cmp-button-disabled-fg,var(--hig-color-label-disabled))'
        ].join(' '),
        /* text：无底无边，hover 叠 4% primary */
        ghost: [
          'bg-transparent text-(--hig-cmp-button-ghost-fg,var(--hig-color-link))',
          'hover:enabled:bg-(--hig-cmp-button-ghost-bg-hover,var(--hig-color-fill-hover))',
          'active:enabled:bg-(--hig-cmp-button-ghost-bg-active,var(--hig-color-fill-selected))',
          'disabled:bg-transparent disabled:text-(--hig-cmp-button-disabled-fg,var(--hig-color-label-disabled))'
        ].join(' '),
        /* filled destructive */
        destructive: [
          'bg-(--hig-cmp-button-error-bg,var(--hig-color-button-filled-error)) text-(--hig-cmp-button-error-fg,var(--hig-color-on-primary))',
          'hover:enabled:bg-(--hig-cmp-button-error-bg-hover,var(--hig-color-button-error-hover))',
          'active:enabled:bg-(--hig-cmp-button-error-bg-active,var(--hig-color-button-error-active))',
          'disabled:bg-(--hig-cmp-button-disabled-bg,var(--hig-color-button-filled-disabled)) disabled:text-(--hig-cmp-button-disabled-fg,var(--hig-color-label-disabled))'
        ].join(' '),
        link: 'h-auto border-0 bg-transparent p-0 normal-case tracking-normal text-(--hig-cmp-button-link-fg,var(--hig-color-link)) hover:enabled:text-(--hig-cmp-button-link-fg-hover,var(--hig-color-link-hover)) hover:enabled:underline'
      },
      /* 高度档位接令牌：改 --hig-size-lg 即整体缩放；图标按钮是 48px 触达区 */
      size: {
        xs: 'h-(--hig-cmp-button-h-xs,var(--hig-size-control-xs)) px-(--hig-cmp-button-px-xs,0.5rem) text-caption',
        sm: 'h-(--hig-cmp-button-h-sm,var(--hig-size-control-sm)) px-(--hig-cmp-button-px-sm,0.75rem)',
        default: 'h-(--hig-cmp-button-h,var(--hig-size-control)) px-(--hig-cmp-button-px,1rem)',
        lg: 'h-(--hig-cmp-button-h-lg,var(--hig-size-control-lg)) px-(--hig-cmp-button-px-lg,1.5rem)',
        xl: 'h-(--hig-cmp-button-h-xl,var(--hig-size-control-xl)) px-(--hig-cmp-button-px-xl,2rem)',
        icon: 'size-(--hig-cmp-button-size-icon,var(--hig-size-control-xl)) p-0',
        'icon-sm': 'size-(--hig-cmp-button-size-icon-sm,var(--hig-size-control)) p-0',
        'icon-lg': 'size-(--hig-cmp-button-size-icon-lg,var(--hig-size-control-2xl)) p-0'
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
