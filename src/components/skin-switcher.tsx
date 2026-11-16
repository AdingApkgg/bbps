'use client'

import { useCallback, useEffect, useState } from 'react'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

/*
 * 皮肤 / 样式修饰符切换器。
 *
 * 两段互相独立：
 *   · 皮肤 data-skin  —— 换一整套设计语言：Apple HIG（默认）/ M2 / Fluent / Carbon
 *   · 修饰符 data-style —— 叠在任意皮肤上的倾向：pointer / underline / compact / text-xl
 *
 * 都写进 localStorage，由 layout 里的内联脚本在首帧前回填，避免闪一下默认样式。
 * 只加属性、不改任何组件代码，默认（Apple）就是定稿的视觉。
 *
 * 两种形态共用一套状态与选项：默认是顶栏下拉（宽屏），inline 是抽屉里的常驻列表（窄屏）。
 */

const SKINS = [
  { id: 'apple', label: 'Apple HIG', note: '默认 · 苹果 · 系统蓝 · 大圆角 · 材质' },
  { id: 'm2', label: 'Material 2', note: '谷歌 · 紫色 · 4dp · 三段影' },
  { id: 'fluent', label: 'Fluent', note: '微软 · 蓝色 · 亚克力 · reveal' },
  { id: 'carbon', label: 'Carbon', note: 'IBM · 直角 · 分隔线 · 密集' }
] as const

const STYLES = [
  { id: 'pointer', label: '手型指针', note: '可点元素显示手型' },
  { id: 'underline', label: '链接下划线', note: '正文链接常显下划线' },
  { id: 'compact', label: '紧凑', note: '收紧纵向留白' },
  { id: 'text-xl', label: '放大字号', note: '全局字阶 +12.5%' }
] as const

type SkinId = (typeof SKINS)[number]['id']
type StyleId = (typeof STYLES)[number]['id']

/* 默认皮肤：没存过值时用 Apple，所以 data-skin 从首帧起就一定有值 */
const DEFAULT_SKIN: SkinId = 'apple'

export const SKIN_STORAGE_KEY = 'bbps-skin'
export const STYLE_STORAGE_KEY = 'bbps-style'

const SKIN_IDS: readonly string[] = SKINS.map((s) => s.id)
const STYLE_IDS: readonly string[] = STYLES.map((s) => s.id)

/* 内联到 <head> 的引导脚本：首帧前设定属性，防闪。皮肤永远有值（默认 Apple） */
export const SKIN_BOOT_SCRIPT = `
try{var s=localStorage.getItem('${SKIN_STORAGE_KEY}');document.documentElement.dataset.skin=(s&&${JSON.stringify(SKIN_IDS)}.indexOf(s)>-1)?s:'${DEFAULT_SKIN}'}catch(e){document.documentElement.dataset.skin='${DEFAULT_SKIN}'}
`

export const STYLE_BOOT_SCRIPT = `
try{var v=(localStorage.getItem('${STYLE_STORAGE_KEY}')||'').split(' ').filter(function(x){return ${JSON.stringify(STYLE_IDS)}.indexOf(x)>-1});if(v.length){document.documentElement.dataset.style=v.join(' ')}}catch(e){}
`

function readStyles(): StyleId[] {
  const raw = document.documentElement.dataset.style ?? ''
  return raw.split(' ').filter((x): x is StyleId => STYLE_IDS.includes(x))
}

function useAppearance() {
  const [skin, setSkin] = useState<SkinId>(DEFAULT_SKIN)
  const [styles, setStyles] = useState<StyleId[]>([])

  useEffect(() => {
    const cur = document.documentElement.dataset.skin
    if (cur && SKIN_IDS.includes(cur)) setSkin(cur as SkinId)
    setStyles(readStyles())
  }, [])

  const pick = useCallback((id: SkinId) => {
    setSkin(id)
    document.documentElement.dataset.skin = id
    // 通知 layout 里的脚本重算 theme-color
    document.dispatchEvent(new Event('bbps:skin'))
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, id)
    } catch {
      // 隐私模式 / 配额满时写不进：本次会话的属性已经设好，只是下次不记住
      void id
    }
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
        // 同上：属性已生效，仅不持久化
        void next
      }
    },
    [styles]
  )

  return { skin, styles, pick, toggleStyle }
}

export function SkinSwitcher({ inline = false }: { inline?: boolean }) {
  const { skin, styles, pick, toggleStyle } = useAppearance()

  if (inline) {
    return (
      <div data-appearance className="flex flex-col gap-1 px-2 py-2">
        <p className="px-2 pt-1 pb-1 text-overline text-on-surface-medium uppercase">皮肤</p>
        {SKINS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s.id)}
            aria-pressed={skin === s.id}
            className="rounded-sm px-2 py-1.5 text-left transition-colors duration-fast-02 ease-standard hover:bg-surface-hover-01 aria-pressed:bg-surface-selected-02"
          >
            <span className="block text-title-sm text-on-surface">{s.label}</span>
            <span className="block text-caption text-on-surface-medium">{s.note}</span>
          </button>
        ))}
        <p className="px-2 pt-3 pb-1 text-overline text-on-surface-medium uppercase">样式修饰</p>
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
        <Button variant="ghost" size="icon" aria-label="切换皮肤与样式" data-look>
          <Palette className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-appearance className="w-64">
        <DropdownMenuLabel>皮肤</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={skin} onValueChange={(v) => pick(v as SkinId)}>
          {SKINS.map((s) => (
            <DropdownMenuRadioItem key={s.id} value={s.id} className="h-auto items-start py-2">
              <span className="block">
                <span className="block text-title-sm text-on-surface">{s.label}</span>
                <span className="block text-caption text-on-surface-medium">{s.note}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuLabel>样式修饰</DropdownMenuLabel>
        {STYLES.map((s) => (
          <DropdownMenuCheckboxItem
            key={s.id}
            checked={styles.includes(s.id)}
            onCheckedChange={() => toggleStyle(s.id)}
            // 勾选一项不该收起菜单，方便连着开几项
            onSelect={(e) => e.preventDefault()}
            className="h-10"
          >
            {s.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
