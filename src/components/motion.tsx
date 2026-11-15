'use client'

import { type HTMLMotionProps, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/* 动效
 *
 * 进场一律 decelerate，时长按场景取 M2 motion 表：
 *  - 展开 / 揭示类（本文件的滚动进场）= medium-2（300ms）；
 *  - 位移距离很短，成组的元素才用 stagger，单项不会飞很远。
 * 曲线就是 M2 的 --md-sys-motion-ease-decelerate / -accelerate，数值一致到每一位；
 * 前段起手快、末段收得干净，没有回弹（framer 的 'easeOut' 会被替换掉）。
 * framer 只吃数字，读不了 CSS 变量，所以这里复制一份常量，改令牌时必须同步。
 */
export const DURATION_REVEAL = 0.3 // = --md-sys-motion-medium-2
export const DURATION_FAST = 0.15 // = --md-sys-motion-short-3
/* 展开 / 折叠（手风琴、设置面板）：M2 的 short-4（200ms） */
export const DURATION_DISCLOSURE = 0.2 // = --md-sys-motion-short-4
export const EASE_ENTRANCE = [0, 0, 0.2, 1] as const // = --md-sys-motion-ease-decelerate
export const EASE_EXIT = [0.4, 0, 1, 1] as const // = --md-sys-motion-ease-accelerate

/* framer 自己用 JS 跑动画，全局 CSS 里那条 reduce 覆盖管不到它，
 * 所以每个过渡都要过一遍这个钩子：reduce 下时长归零，位移和缩放直接落位。 */
export function useMotionDuration(duration: number) {
  const reduce = useReducedMotion()
  return reduce ? 0 : duration
}

/* ── Fade-in on scroll (viewport-triggered) ── */

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  /** Delay in seconds */
  delay?: number
  /** Direction to come from */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Distance in px */
  distance?: number
  /** Duration in seconds */
  duration?: number
  /** 挂载即播放，不等 IntersectionObserver。首屏元素应当开启 */
  eager?: boolean
}

const directionOffset = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 }
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 8,
  duration = DURATION_REVEAL,
  eager = false,
  ...props
}: FadeInProps) {
  const offset = directionOffset[direction]
  const shown = { opacity: 1, x: 0, y: 0 }
  const ms = useMotionDuration(duration)

  /*
   * eager：挂载即播放，不等 IntersectionObserver。
   *
   * 首屏元素本来就在视口里，却要等 IO 回调才开始动画，白白推迟一帧以上。
   * 更要紧的是 IO 在页面不渲染时根本不触发（后台标签页、无头/不合成帧的环境），
   * 那种情况下元素会永久停在 initial 的 opacity: 0 —— 内容等于不可见。
   * 首屏内容不该把可见性押在 IO 上。
   */
  const trigger = eager
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, margin: '-64px' } as const }

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x * distance, y: offset.y * distance }}
      {...trigger}
      transition={{ duration: ms, delay, ease: EASE_ENTRANCE }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger container + item ── */

interface StaggerProps {
  children: ReactNode
  className?: string
  /** Delay between each child */
  stagger?: number
  /** Initial delay before first child */
  delay?: number
}

export function Stagger({ children, className, stagger = 0.04, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-64px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  const ms = useMotionDuration(DURATION_REVEAL)
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: ms, ease: EASE_ENTRANCE } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
