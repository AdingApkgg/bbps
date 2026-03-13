import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { ArtalkComments } from '@/components/artalk-comments'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support Horsebean Private Server with a donation',
  alternates: {
    canonical: `${SITE_URL}/en/donate/`,
    languages: { 'zh-CN': `${SITE_URL}/donate/` }
  },
  openGraph: {
    title: 'Donate | Horsebean Private Server',
    description: 'Support Horsebean Private Server with a donation',
    url: `${SITE_URL}/en/donate/`,
    locale: 'en_US'
  }
}

export default function DonateEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="donate" />
      <div className="container mx-auto max-w-3xl px-4 pb-16">
        <ArtalkComments pageKey="/donate/" pageTitle="Donate" />
      </div>
    </div>
  )
}
