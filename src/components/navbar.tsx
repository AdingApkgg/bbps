'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, Heart, Languages } from 'lucide-react'
import { useLocale, useLocalePref } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { getDonateItem } from '@/lib/nav-items'
import { SiteDrawer } from '@/components/site-drawer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Navbar() {
  const locale = useLocale()
  const { pref, setPref } = useLocalePref()
  const dict = getDictionary(locale)
  const donate = getDonateItem(locale === 'en' ? '/en' : '', dict)

  return (
    <header className="sticky top-0 z-(--md-sys-layer-header) h-14 w-full bg-surface-01 shadow-sm">
      {/* 导航在左侧栏（[data-rail]），顶栏只留 logo、语言开关和窄屏菜单 */}
      <div className="container-page flex h-full items-center">
        {/* Logo */}
        <Link href={locale === 'en' ? '/en' : '/'} className="flex items-center gap-2">
          {/* 28px 固定，档位落在 imageSizes 的 112 上；retina 也不该拉更大的图 */}
          <Image
            src="/assets/images/logo/logo.avif"
            alt={dict.site.name}
            width={28}
            height={28}
            sizes="28px"
            className="h-7 w-7 object-contain"
          />
          <span className="font-medium text-title-sm">{dict.site.name}</span>
        </Link>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* 捐赠：唯一常驻的彩色入口，实心爱心 + error 色，光靠颜色就跳到眼里 */}
          <Link
            href={donate.href}
            aria-label={donate.label}
            className={cn(
              'inline-flex size-(--md-sys-size-control-xl) items-center justify-center rounded-sm',
              'text-error transition-colors duration-fast-02 ease-standard',
              'hover:bg-chip-background-red active:bg-chip-background-red'
            )}
          >
            <Heart className="h-[1.35rem] w-[1.35rem] fill-current" />
          </Link>

          {/* 主题：和语言同属显示偏好，排在捐赠后面，不跟功能入口争位置 */}
          <ThemeToggle />

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setPref('zh')}
                className={cn(pref === 'zh' && 'font-medium text-link')}
              >
                <Languages className="mr-2 h-4 w-4" />
                中文
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPref('en')}
                className={cn(pref === 'en' && 'font-medium text-link')}
              >
                <Languages className="mr-2 h-4 w-4" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 窄屏抽屉（宽屏导航在 [data-rail]） */}
          <SiteDrawer />
        </div>
      </div>
    </header>
  )
}
