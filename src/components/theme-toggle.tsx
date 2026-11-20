'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getDictionary } from '@/lib/i18n'
import { useLocale } from '@/contexts/locale-context'
import { applyTheme, isTheme, readTheme, THEME_EVENT, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const ICONS = { auto: Monitor, light: Sun, dark: Moon }
/* 选项 → 字典键，显式写开免得在 JSX 里拼字符串 */
const LABELS = { auto: 'themeAuto', light: 'themeLight', dark: 'themeDark' } as const

/**
 * 主题开关：跟随系统 / 浅色 / 深色。
 *
 * 状态是外部真相（localStorage + DOM 属性），不是 React state；首屏由
 * `THEME_SCRIPT` 内联脚本先落地，这里挂载后只是读回来保持图标同步。
 */
export function ThemeToggle() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  /* null = 还没挂载，先按 auto 渲染，免得图标和服务端不一致 */
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(readTheme())
    /* `applyTheme` 会发这个事件，让多开的分支/其它订阅者跟上 */
    const sync = () => setTheme(readTheme())
    window.addEventListener(THEME_EVENT, sync)
    return () => window.removeEventListener(THEME_EVENT, sync)
  }, [])

  const current = theme ?? 'auto'
  const Icon = ICONS[current]

  const choose = (next: Theme) => {
    if (!isTheme(next)) return
    applyTheme(next)
    setTheme(next)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{dict.nav.theme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(ICONS) as Theme[]).map((option) => {
          const OptionIcon = ICONS[option]
          return (
            <DropdownMenuItem
              key={option}
              onClick={() => choose(option)}
              className={cn(current === option && 'font-medium text-link')}
            >
              <OptionIcon className="mr-2 h-4 w-4" />
              {dict.nav[LABELS[option]]}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
