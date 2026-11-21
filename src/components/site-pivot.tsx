'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { getNavItems } from '@/lib/nav-items'
import { cn } from '@/lib/utils'

/* 顶部枢轴导航：文字横向分栏切换，仅窄屏使用（宽屏走左侧常驻导航栏） */
export function SitePivot() {
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''
  const items = getNavItems(prefix, dict)

  const isActive = (href: string) => pathname === href || pathname === `${href}/`

  return (
    <div data-pivot className="hidden w-full border-b bg-surface-01">
      <nav className="container-page flex h-11 items-stretch gap-1 overflow-x-auto">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={cn(
              'relative flex shrink-0 items-center px-3 text-body-02 text-on-surface-medium',
              isActive(item.href) && 'font-semibold text-on-surface'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
