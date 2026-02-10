import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'

export const metadata: Metadata = {
  title: 'Server Rules',
  description: 'Horsebean Private Server server rules and community guidelines',
  alternates: {
    canonical: `${SITE_URL}/en/server-rules/`,
    languages: { 'zh-CN': `${SITE_URL}/server-rules/` }
  },
  openGraph: {
    title: 'Server Rules | Horsebean Private Server',
    description: 'Horsebean Private Server server rules and community guidelines',
    url: `${SITE_URL}/en/server-rules/`,
    locale: 'en_US'
  }
}

export default function ServerRulesEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="serverRules" />
    </div>
  )
}
