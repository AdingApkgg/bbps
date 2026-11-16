'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, Languages } from 'lucide-react'
import { useLocale, useLocalePref } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { SiteDrawer } from '@/components/site-drawer'
import { SkinSwitcher } from '@/components/skin-switcher'
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

 return (
 <header className="sticky top-0 z-50 h-14 w-full bg-surface-01 shadow-sm">
 {/* 导航在左侧栏（[data-rail]），顶栏只留 logo、语言开关和窄屏菜单 */}
 <div className="container-page flex h-full items-center">
 {/* Logo */}
 <Link href={locale === 'en' ? '/en' : '/'} className="flex items-center gap-2">
 <Image
 src="/assets/images/logo/logo.avif"
 alt={dict.site.name}
 width={28}
 height={28}
 className="h-7 w-7 object-contain"
 />
 <span className="font-medium text-title-sm">{dict.site.name}</span>
 </Link>

 {/* Right side actions */}
 <div className="ml-auto flex items-center gap-1">
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

 {/* 皮肤 / 样式修饰：桌面常驻按钮，窄屏收进抽屉（见 site-drawer） */}
 <SkinSwitcher />

 {/* 窄屏抽屉（宽屏导航在 [data-rail]） */}
 <SiteDrawer />
 </div>
 </div>
 </header>
 )
}
