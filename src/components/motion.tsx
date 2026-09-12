'use client'

import { type HTMLMotionProps, motion } from 'framer-motion'
import type { ReactNode } from 'react'

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
  distance = 24,
  duration = 0.5,
  eager = false,
  ...props
}: FadeInProps) {
  const offset = directionOffset[direction]
  const shown = { opacity: 1, x: 0, y: 0 }

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
      transition={{ duration, delay, ease: 'easeOut' }}
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

export function Stagger({ children, className, stagger = 0.08, delay = 0 }: StaggerProps) {
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
            staggerChildren: stagger,
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
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
