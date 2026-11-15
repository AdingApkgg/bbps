'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

/* Material Design 2 Slider
 *
 * 规格取自 m2.material.io/components/sliders 与 material-components-web 的
 * slider/_variables.scss：
 *  - 轨道 4dp 直角，已填充段 primary、未填充段 primary 24%；
 *  - 手柄 20dp 圆，primary 实心 + 2dp 影；hover/focus/pressed 时手柄外扩到 24/26/28dp 不换色；
 *  - 状态层叠在 40dp 触达圆上：hover 4%、focus 12%、pressed 12%；
 *  - focus 是 2px primary 描边，外扩 2px。
 *
 * M2 的连续/离散、带值标签等变体没做，只做连续单值或多值（value 数组天然支持）。
 * `compact` 是附在栏位里的细轨道变体：轨道 2dp、手柄 12dp —— 用于播放条与音量，
 * 命中区仍是 18dp 高。
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
        // 18dp 触摸区，配合手柄 20dp 留出上下余量
        compact ? 'py-1.5' : 'py-[9px]',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-38',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'relative w-full grow overflow-hidden bg-primary/24',
          compact ? 'h-0.5' : 'h-1'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-primary"
        />
      </SliderPrimitive.Track>
      {(props.value ?? props.defaultValue ?? [0]).map((v) => (
        <SliderPrimitive.Thumb
          key={v}
          data-slot="slider-thumb"
          className={cn(
            'relative block rounded-full bg-primary shadow-sm',
            compact ? 'size-3' : 'size-5',
            'transition-[box-shadow,transform] duration-fast-01 ease-standard',
            'before:absolute before:-inset-2.5 before:rounded-full before:content-[""]',
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
