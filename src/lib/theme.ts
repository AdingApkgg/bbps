/**
 * 主题预置。
 *
 * 三档：`auto` 跟随系统（默认）、`light`、`dark`。
 *
 * 为什么不是只有两档开关：站点原来就是纯 `@media (prefers-color-scheme)`，
 * 硬塞一个二值开关会把「跟随系统」这条默认路径弄丢 —— 系统变了站点不跟着变。
 * `auto` 显式表达「没意见」，也就把「用户明确选了浅色，但系统是深色」和
 * 「用户没意见，系统是深色」区分开了。
 *
 * 值写在 `<html data-theme>` 上，纯 CSS 靠选择器分支；不像 class 方案要给
 * 每个组件加判断。
 */
export type Theme = 'auto' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'bbps-theme'

/** 手动切换后靠这个事件通知 `usePrefersDark` 之类的订阅者（matchMedia 不会为它触发） */
export const THEME_EVENT = 'bbps:theme'

/**
 * 浏览器 UI 底色，与 `--hig-color-surface`（systemBackground / 纯黑）一致。
 * 手写而不是读 CSS 变量：内联脚本要在样式表之前跑，那时变量还取不到。
 */
export const THEME_COLORS = { light: '#f2f2f7', dark: '#000000' } as const

export function isTheme(value: string | null | undefined): value is Theme {
  return value === 'auto' || value === 'light' || value === 'dark'
}

/**
 * 读出已保存的主题。隐私模式下 localStorage 会抛，一律退回 `auto`。
 */
export function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

/**
 * 把主题落到 DOM。`auto` 删掉属性，让 CSS 的 `@media` 重新接管。
 *
 * 同时改 `color-scheme`：浏览器据此决定原生滚动条、表单控件、`<select>` 弹层
 * 的配色，只改自定义属性的话这些地方会跟站点反着走。
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'auto') {
    root.removeAttribute('data-theme')
    root.style.removeProperty('color-scheme')
  } else {
    root.dataset.theme = theme
    root.style.colorScheme = theme
  }

  /* 带 media 的那几条是 Next 按「跟随系统」生成的，手动选定后要把它们拆了重写，
     否则系统是浅色时地址栏仍是浅色 */
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.remove()
  if (theme !== 'auto') {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = THEME_COLORS[theme]
    document.head.append(meta)
  }

  try {
    if (theme === 'auto') window.localStorage.removeItem(THEME_STORAGE_KEY)
    else window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* 隐私模式下不了盘，本次会话仍可用 */
  }

  window.dispatchEvent(new Event(THEME_EVENT))
}

/**
 * 首屏内联脚本（字符串）。
 *
 * 必须内联且放在 `<head>`：等 React 水合再改属性会先闪一帧系统色。
 * 只有显式选过才动 DOM，`auto` 什么都不做，保持 CSS 原生行为。
 *
 * 手动值也把 media 版 theme-color 全删了再写：留着的话系统浅色时地址栏不变。
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')return;var r=document.documentElement;r.setAttribute('data-theme',t);r.style.colorScheme=t;var s=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<s.length;i++)s[i].remove();var m=document.createElement('meta');m.name='theme-color';m.content=t==='dark'?'${THEME_COLORS.dark}':'${THEME_COLORS.light}';document.head.appendChild(m)}catch(e){}})()`
