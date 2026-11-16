'use client'

import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { SiteNavList } from '@/components/site-nav-list'

/* 桌面左侧导航栏（IBM Carbon UI shell 的 left panel）
 *
 * 只在 carbon 皮肤下由 CSS 显示；M2 默认、apple、fluent 分别走各自的结构。
 * 常驻 DOM 以保证皮肤切换不重挂载。
 */
export function SiteRail() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <aside data-rail className="hidden w-64 shrink-0" aria-label={dict.nav.toggleMenu}>
      <nav className="sticky top-14 flex max-h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto py-2">
        <SiteNavList />
      </nav>
    </aside>
  )
}
