'use client'

import { useCallback, useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

/*
 * 样式修饰符切换器。
 *
 * 设计基准已经统一到 Apple HIG（iOS 系统外观），不再有「皮肤」这个维度，
 * 只剩叠在所有页面上的一组倾向：pointer / underline / compact / text-xl。
 *
 * 写进 localStorage，由 layout 里的内联脚本在首帧前回填，避免闪一下默认样式。
 * 只加属性（html[data-style]）、不改任何组件代码。
 *
 * 两种形态共用一套状态与选项：默认是顶栏弹出面板（宽屏），inline 是抽屉里的常驻列表（窄屏）。
 */

const STYLES = [
  { id: 'pointer', label: '手型指针', note: '可点元素显示手型' },
  { id: 'underline', label: '链接下划线', note: '正文链接常显下划线' },
  { id: 'compact', label: '紧凑', note: '收紧纵向留白' },
  { id: 'text-xl', label: '放大字号', note: '全局字阶 +12.5%' }
] as const

type StyleId = (typeof STYLES)[number]['id']

const STYLE_STORAGE_KEY = 'bbps-style'

const STYLE_IDS: readonly string[] = STYLES.map((s) => s.id)

/* 内联到 <head> 的引导脚本：首帧前设定属性，防闪 */
export const STYLE_BOOT_SCRIPT = `
try{var v=(localStorage.getItem('${STYLE_STORAGE_KEY}')||'').split(' ').filter(function(x){return ${JSON.stringify(STYLE_IDS)}.indexOf(x)>-1});if(v.length){document.documentElement.dataset.style=v.join(' ')}}catch(e){}
`

function readStyles(): StyleId[] {
  const raw = document.documentElement.dataset.style ?? ''
  return raw.split(' ').filter((x): x is StyleId => STYLE_IDS.includes(x))
}

function useStyles() {
  const [styles, setStyles] = useState<StyleId[]>([])

  useEffect(() => {
    setStyles(readStyles())
  }, [])

  const toggleStyle = useCallback(
    (id: StyleId) => {
      const next = styles.includes(id) ? styles.filter((s) => s !== id) : [...styles, id]
      setStyles(next)
      if (next.length === 0) delete document.documentElement.dataset.style
      else document.documentElement.dataset.style = next.join(' ')
      try {
        localStorage.setItem(STYLE_STORAGE_KEY, next.join(' '))
      } catch {
        // 隐私模式 / 配额满时写不进：本次会话的属性已经设好，只是下次不记住
        void next
      }
    },
    [styles]
  )

  return { styles, toggleStyle }
}

export function StyleSwitcher({ inline = false }: { inline?: boolean }) {
  const { styles, toggleStyle } = useStyles()

  if (inline) {
    return (
      <div data-appearance className="flex flex-col gap-1 px-2 py-2">
        <p className="px-2 pt-1 pb-1 text-overline text-on-surface-medium">样式修饰</p>
        <div className="grid grid-cols-2 gap-1">
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleStyle(s.id)}
              aria-pressed={styles.includes(s.id)}
              title={s.note}
              className="rounded-sm border border-outline-01 px-2 py-1 text-caption text-on-surface transition-colors duration-fast-02 ease-standard hover:bg-surface-hover-01 aria-pressed:border-primary aria-pressed:bg-surface-selected-02 aria-pressed:text-primary"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="切换样式修饰" data-look>
          <SlidersHorizontal className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-appearance className="w-56">
        <DropdownMenuLabel>样式修饰</DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        {STYLES.map((s) => (
          <DropdownMenuCheckboxItem
            key={s.id}
            checked={styles.includes(s.id)}
            onCheckedChange={() => toggleStyle(s.id)}
            // 勾选一项不该收起菜单，方便连着开几项
            onSelect={(e) => e.preventDefault()}
          >
            {s.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
