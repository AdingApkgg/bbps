'use client'

import Link from 'next/link'
import { Eye, FileText, Users } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useVisitorStats } from '@/hooks/use-visitor-stats'

export function Footer() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''
  const { sitePv, siteUv, pagePv } = useVisitorStats()

  const linkClass =
    'text-sm text-muted-foreground transition-colors hover:text-foreground'

  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.site.name}</h3>
            <p className="text-sm text-muted-foreground">
              {dict.footer.description}
            </p>
          </div>

          {/* Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`${prefix}/downloads`} className={linkClass}>
                  {dict.nav.downloads}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/commands`} className={linkClass}>
                  {dict.nav.commands}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/stats`} className={linkClass}>
                  {dict.nav.stats}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/rank`} className={linkClass}>
                  {dict.nav.rank}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/blog`} className={linkClass}>
                  {dict.nav.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* External */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{dict.footer.community}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://qm.qq.com/q/qDf9qDK8g2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {locale === 'zh' ? 'QQ 群' : 'QQ Group'}
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/rGAGWDerzB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Discord
                </a>
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

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {locale === 'zh' ? '法律信息' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${prefix}/privacy-policy`}
                  className={linkClass}
                >
                  {dict.nav.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/server-rules`}
                  className={linkClass}
                >
                  {dict.nav.serverRules}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <div className="mb-3 flex items-center justify-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{dict.footer.pageviews}</span>
              <span className="font-medium tabular-nums text-foreground">
                {sitePv !== null ? sitePv.toLocaleString() : '-'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{dict.footer.visitors}</span>
              <span className="font-medium tabular-nums text-foreground">
                {siteUv !== null ? siteUv.toLocaleString() : '-'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>{locale === 'zh' ? '本页访问' : 'This Page'}</span>
              <span className="font-medium tabular-nums text-foreground">
                {pagePv !== null ? pagePv.toLocaleString() : '-'}
              </span>
            </span>
          </div>
          <p>{dict.site.copyright}</p>
          <p className="mt-1 text-xs">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
