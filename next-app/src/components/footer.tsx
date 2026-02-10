'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  const linkClass =
    'text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline'

  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/logo/logo.avif"
                alt="海岛奇兵私服"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-lg font-semibold">{dict.site.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {dict.footer.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={locale === 'en' ? '/en/downloads' : '/downloads'} className={linkClass}>
                  {dict.nav.downloads}
                </Link>
              </li>
              <li>
                <Link href={locale === 'en' ? '/en/commands' : '/commands'} className={linkClass}>
                  {dict.nav.commands}
                </Link>
              </li>
              <li>
                <Link href={locale === 'en' ? '/en/stats' : '/stats'} className={linkClass}>
                  {dict.nav.stats}
                </Link>
              </li>
              <li>
                <Link href={locale === 'en' ? '/en/comments' : '/comments'} className={linkClass}>
                  {dict.nav.comments}
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.30hb.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {dict.nav.drive}
                </a>
              </li>
              <li>
                <Link
                  href={locale === 'en' ? '/en/blog' : '/blog'}
                  className={linkClass}
                >
                  {dict.nav.blog}
                </Link>
              </li>
              <li>
                <a
                  href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {dict.nav.editor}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">{dict.footer.community}</h3>
            <div className="flex gap-3">
              <a
                href="https://qm.qq.com/q/qDf9qDK8g2"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img
                  src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
                  alt="QQ群"
                  className="h-9 w-9"
                />
              </a>
              <a
                href="https://discord.gg/rGAGWDerzB"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3670/3670157.png"
                  alt="Discord"
                  className="h-9 w-9"
                />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <div className="text-center text-sm text-muted-foreground">
          <p>{dict.site.copyright}</p>
          <p className="mt-1 text-xs">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
