import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* tailwind-merge 默认配置不认识本项目 `@theme inline` 里的自定义刻度：
 * 任何未知的 `text-*` 都会被当成文字颜色，于是 `text-body text-on-surface-medium`
 * 这类「字号 + 颜色」写法会让字号被判定为冲突而整条丢弃。
 * 这里把字号刻度显式登记进 font-size 组，颜色组维持默认。
 * 新增 --text-* 令牌时同步补进 FONT_SIZES。
 */
const FONT_SIZES = [
  'display-lg',
  'display-md',
  'display-sm',
  'headline-lg',
  'headline-md',
  'headline-sm',
  'title-lg',
  'title-md',
  'title-sm',
  'body-01',
  'body-02',
  'label',
  'label-sm',
  'caption',
  'overline',
  'button'
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }]
    }
  }
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
