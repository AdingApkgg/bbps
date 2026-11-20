'use client'

import type { ReactNode } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'

/**
 * 只加载动画特性，不加载 `motion` 全量包。
 *
 * `motion.div` 自带全部 features（布局动画、拖拽、手势……），打进首屏要十几 KB，
 * 而本站只用到 opacity/x/y 过渡和 AnimatePresence —— 那属于 `domAnimation`。
 * 所以组件一律用 `m.*` 而不是 `motion.*`，再把特性表在这里懒加载一次。
 *
 * `strict` 会在误用 `motion.*` 时报错，防止有人后加组件时把全量包带回来。
 * 真的要用布局动画（`layout` / `layoutId` / `drag`）时，把 features 换成 `domMax`。
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
