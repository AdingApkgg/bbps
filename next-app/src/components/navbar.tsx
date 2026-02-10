'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

/** 当前路径切换到另一语言后的路径（不跳回首页） */
function getLocaleSwitchPath(pathname: string, currentLocale: 'zh' | 'en'): string {
  if (currentLocale === 'zh') {
    if (pathname === '/') return '/en'
    return `/en${pathname}`
  }
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/'
  return '/'
}

export function Navbar() {
  const pathname = usePathname()
  const locale = useLocale()
  const dict = getDictionary(locale)
  const otherLocalePath = getLocaleSwitchPath(pathname ?? '/', locale)

  const navLink =
    'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="flex items-center gap-2 font-semibold text-primary"
        >
          <Image
            src="/assets/images/logo/logo.avif"
            alt="海岛奇兵私服"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="hidden sm:inline-block">{dict.site.name}</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <Link href={locale === 'en' ? '/en/downloads' : '/downloads'} className={navLink}>
            {dict.nav.downloads}
          </Link>
          <Link href={locale === 'en' ? '/en/commands' : '/commands'} className={navLink}>
            {dict.nav.commands}
          </Link>
          <Link href={locale === 'en' ? '/en/stats' : '/stats'} className={navLink}>
            {dict.nav.stats}
          </Link>
          <Link href={locale === 'en' ? '/en/comments' : '/comments'} className={navLink}>
            {dict.nav.comments}
          </Link>
          <a
            href="https://drive.30hb.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className={navLink}
          >
            {dict.nav.drive}
          </a>
          <Link href={locale === 'en' ? '/en/blog' : '/blog'} className={navLink}>
            {dict.nav.blog}
          </Link>
          <a
            href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
            target="_blank"
            rel="noopener noreferrer"
            className={navLink}
          >
            {dict.nav.editor}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={locale === 'zh' ? 'https://qm.qq.com/q/qDf9qDK8g2' : 'https://discord.gg/rGAGWDerzB'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden opacity-80 transition-opacity hover:opacity-100 sm:block"
            title={locale === 'zh' ? 'QQ群' : 'Discord'}
          >
            {locale === 'zh' ? (
              <img
                src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
                alt="QQ"
                className="h-6 w-6"
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/3670/3670157.png"
                alt="Discord"
                className="h-6 w-6"
              />
            )}
          </a>
          <Button variant={locale === 'en' ? 'default' : 'ghost'} size="sm" asChild>
            <Link href={locale === 'zh' ? otherLocalePath : (pathname ?? '/en')}>
              EN
            </Link>
          </Button>
          <Button variant={locale === 'zh' ? 'default' : 'ghost'} size="sm" asChild>
            <Link href={locale === 'en' ? otherLocalePath : (pathname ?? '/')}>
              中文
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
