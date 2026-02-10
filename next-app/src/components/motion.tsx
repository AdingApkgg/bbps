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
  ...props
}: FadeInProps) {
  const offset = directionOffset[direction]
  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x * distance, y: offset.y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
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

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0
}: StaggerProps) {
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
