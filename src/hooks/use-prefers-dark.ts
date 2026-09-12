'use client'

import { useSyncExternalStore } from 'react'

/**
 * 系统是否偏好暗色。
 *
 * 站点的暗色主题是纯 CSS 的 `@media (prefers-color-scheme: dark)`，没有手动开关，
 * 所以这里不读任何存储，直接问浏览器。给那些必须用 JS 告知主题的第三方组件用
 * （目前只有 Artalk —— 它的 darkMode 是个构造参数，CSS 管不到）。
 *
 * 用 useSyncExternalStore 而不是 useEffect + setState：
 * 后者会在挂载后多跑一轮渲染，也过不了 react-hooks/set-state-in-effect。
 */
const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(DARK_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(DARK_QUERY).matches
}

/** 服务端渲染时无从得知，按亮色出；挂载后立刻会被真实值纠正 */
function getServerSnapshot(): boolean {
  return false
}

export function usePrefersDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
