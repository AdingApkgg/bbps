'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { getNavItems } from '@/lib/nav-items'
import { cn } from '@/lib/utils'

/* 底部标签栏（Apple HIG 的 tab bar）
 *
 * 手机端 5 个主入口常驻底部；只在 <50rem 由 CSS 显示。
 */
export function SiteTabBar() {
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''
  const items = getNavItems(prefix, dict)
  const primary = items.slice(0, 5)

  const isActive = (href: string) => pathname === href || pathname === `${href}/`

  return (
    <nav
      data-tabbar
      data-dock
      className="pointer-events-auto hidden fixed inset-x-0 bottom-0 z-(--md-sys-layer-dock) border-t bg-surface-01/90 backdrop-blur"
      aria-label={dict.nav.toggleMenu}
    >
      <div className="flex h-14 items-stretch">
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-label text-on-surface-medium',
              isActive(item.href) && 'text-link'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
