'use client'

import { useSyncExternalStore } from 'react'
import { readTheme, THEME_EVENT } from '@/lib/theme'

/**
 * 当前生效的暗色状态。
 *
 * 给那些只能靠 JS 告知主题的第三方组件用（目前只有 Artalk —— 它的 darkMode
 * 是个构造参数，CSS 管不到）。
 *
 * 优先级：手动选的 `data-theme` 先，`auto` 才去问系统 —— 和 CSS 完全同构
 * （见 src/styles/tokens.css 里 `:root:not([data-theme='light'])` 那套写法）。
 * 两处实现必须一起改，否则 Artalk 会跟正文反着来。
 *
 * 用 useSyncExternalStore 而不是 useEffect + setState：
 * 后者会在挂载后多跑一轮渲染，也过不了 react-hooks/set-state-in-effect。
 */
const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(DARK_QUERY)
  mq.addEventListener('change', onChange)
  // 手动切换主题不走 media query，得另听一个事件
  window.addEventListener(THEME_EVENT, onChange)
  return () => {
    mq.removeEventListener('change', onChange)
    window.removeEventListener(THEME_EVENT, onChange)
  }
}

function getSnapshot(): boolean {
  const theme = readTheme()
  if (theme !== 'auto') return theme === 'dark'
  return window.matchMedia(DARK_QUERY).matches
}

/** 服务端渲染时无从得知，按亮色出；挂载后立刻会被真实值纠正 */
function getServerSnapshot(): boolean {
  return false
}

export function usePrefersDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
