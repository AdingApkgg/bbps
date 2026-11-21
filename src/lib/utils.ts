import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* tailwind-merge 默认配置不认识本项目 `@theme inline` 里的自定义刻度：
 * 任何未知的 `text-*` 都会被当成文字颜色，于是 `text-body text-on-surface-medium`
 * 这类「字号 + 颜色」写法会让字号被判定为冲突而整条丢弃。
 * 这里把字号刻度显式登记进 font-size 组，颜色组维持默认。
 * 新增 --text-* 令牌时同步补进 FONT_SIZES。
 *
 * 圆角与高度同理：`rounded-*` / `h-*` 是本项目自建刻度（值全部是 var(--hig-*)），
 * 不登记的话 `rounded-sm rounded-lg` 会两条都留下、后者才生效，调试时看不到真实来源。
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

const RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full', 'pill']

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
      rounded: [{ rounded: RADII }]
    }
  }
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
