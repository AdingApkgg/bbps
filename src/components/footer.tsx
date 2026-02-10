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
        <div className="text-center text-sm text-muted-foreground">
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
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed">
            {dict.footer.disclaimer}
            {' '}
            <a
              href={dict.footer.fanContentPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              {dict.footer.fanContentPolicy}
            </a>
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href={`${prefix}/privacy-policy`} className={linkClass}>
              {dict.nav.privacyPolicy}
            </Link>
            <Link href={`${prefix}/server-rules`} className={linkClass}>
              {dict.nav.serverRules}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
