'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { getExternalItems, getNavItems } from '@/lib/nav-items'
import { cn } from '@/lib/utils'

/* 导航条目列表：桌面侧栏与窄屏抽屉共用，避免两份写死的名单
 *
 * 密度、圆角、指示条全部由各皮肤 CSS 决定（[data-rail] / [data-drawer] 下的 a）。
 */
export function SiteNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''
  const items = getNavItems(prefix, dict)
  const external = getExternalItems(dict)

  const isActive = (href: string) => pathname === href || pathname === `${href}/`
  const cls = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-4 py-2 text-body-02 text-on-surface-medium',
      'hover:bg-surface-hover-01',
      active && 'bg-surface-selected-02 text-on-surface'
    )

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cls(isActive(item.href))}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </Link>
      ))}
      <div className="my-2 h-px bg-outline-01" />
      {external.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className={cls(false)}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
          <ExternalLink className="ml-auto h-3.5 w-3.5" />
        </a>
      ))}
      <Link
        href={`${prefix}/donate`}
        onClick={onNavigate}
        aria-current={isActive(`${prefix}/donate`) ? 'page' : undefined}
        className={cls(isActive(`${prefix}/donate`))}
      >
        {dict.nav.donate}
      </Link>
    </>
  )
}
