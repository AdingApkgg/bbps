'use client'

import type * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

/* Slider
 *
 * 取形按 HIG：4px 全圆角轨道，未填充段填充灰、已填充段 primary；
 * 手柄 28px 圆、恒白底 + 悬浮实体影。
 *
 * 外观是**单一来源**，只在本文件：`hig.css` 里不再有 [data-slot="slider*"] 规则。
 * 轨道与手柄恒为 4px / 28px，不随 compact 变尺寸——HIG 滑杆只有一种规格，
 * compact 只减少纵向留白，缩小轨道反而让播放条更难对齐。
 *
 * 连续/离散、值标签等变体没做，只做连续单值或多值（value 数组天然支持）。
 * `compact` 只把上下触达留白收成 8px，用于播放条与音量这类密集区。
 *
 * 外观过 `--hig-cmp-slider-*` 槽（轨道/已填充/手柄/尺寸），父级赋值即覆盖。
 */
function Slider({
  className,
  compact,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { compact?: boolean }) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        // 18px 触摸区，配合手柄留出上下余量
        // 18px 触达留白；compact 收到 8px，命中区仍 ≥44px
        compact ? 'py-2' : 'py-(--hig-size-slider-pad)',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative w-full grow overflow-hidden rounded-full bg-(--hig-cmp-slider-track-bg,var(--hig-color-fill-quaternary)) h-(--hig-cmp-slider-track-h,0.25rem)'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-(--hig-cmp-slider-range-bg,var(--hig-color-primary))"
        />
      </SliderPrimitive.Track>
      {(props.value ?? props.defaultValue ?? [0]).map((v) => (
        <SliderPrimitive.Thumb
          key={v}
          data-slot="slider-thumb"
          className={cn(
            'relative block size-(--hig-cmp-slider-thumb,1.75rem) rounded-full bg-(--hig-cmp-slider-thumb-bg,var(--hig-palette-white)) shadow-[var(--hig-shadow-thumb)]',
            'transition-[box-shadow,transform] duration-fast-01 ease-standard',
            'before:absolute before:-inset-2 before:rounded-full before:content-[""]',
            'before:transition-colors before:duration-fast-01 before:ease-standard',
            'hover:before:bg-primary/4',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            'focus-visible:before:bg-primary/12',
            'active:before:bg-primary/12',
            'data-[disabled]:shadow-none'
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
