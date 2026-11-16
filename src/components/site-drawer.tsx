'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SiteNavList } from '@/components/site-nav-list'
import { SkinSwitcher } from '@/components/skin-switcher'

/* 窄屏导航抽屉：Radix Dialog 提供 scrim、Esc、焦点陷阱与 aria
 *
 * 只在 <50rem 显示触发按钮（header.sticky [data-menu]）；宽度与形态由各皮肤 CSS 决定。
 */
export function SiteDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)

  // 路由变化后关闭，避免返回时抽屉还开着
  useEffect(() => {
    if (pathname) setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* 用 SheetTrigger asChild 包住按钮：Radix 才知道触发者，Esc / 关闭后焦点会回到菜单键 */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" data-menu>
          <Menu className="h-5 w-5" />
          <span className="sr-only">{dict.nav.toggleMenu}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        data-drawer=""
        className="w-64 max-w-[85vw]"
        aria-label={dict.nav.toggleMenu}
      >
        <SheetTitle className="sr-only">{dict.nav.toggleMenu}</SheetTitle>
        <SheetDescription className="sr-only">{dict.site.name}</SheetDescription>
        <nav className="flex flex-col pt-3 pb-4">
          <SiteNavList onNavigate={() => setOpen(false)} />
          {/* 皮肤 / 样式修饰：宽屏在顶栏，窄屏收进这里 */}
          <div data-drawer-appearance className="mt-2 border-t border-outline pt-2">
            <SkinSwitcher inline />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
