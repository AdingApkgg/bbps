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

 const linkClass = 'text-body-02 text-on-surface-medium transition-colors duration-fast-01 hover:text-on-surface'

 return (
 <footer className="border-t">
 <div className="container-m2 py-8 md:py-12">
 <div className="text-center text-body-02 text-on-surface-medium">
 <div className="mb-3 flex items-center justify-center gap-6">
 <span className="inline-flex items-center gap-1">
 <Eye className="h-3.5 w-3.5" />
 <span className="font-medium tabular-nums text-on-surface">
 {sitePv !== null ? sitePv.toLocaleString() : '-'}
 </span>
 </span>
 <span className="inline-flex items-center gap-1">
 <Users className="h-3.5 w-3.5" />
 <span className="font-medium tabular-nums text-on-surface">
 {siteUv !== null ? siteUv.toLocaleString() : '-'}
 </span>
 </span>
 <span className="inline-flex items-center gap-1">
 <FileText className="h-3.5 w-3.5" />
 <span className="font-medium tabular-nums text-on-surface">
 {pagePv !== null ? pagePv.toLocaleString() : '-'}
 </span>
 </span>
 </div>
 <p>{dict.site.copyright}</p>
 <p className="mx-auto mt-3 max-w-xl text-label leading-relaxed">
 {dict.footer.disclaimer}{' '}
 <a
 href={dict.footer.fanContentPolicyUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="underline transition-colors duration-fast-01 hover:text-on-surface"
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
