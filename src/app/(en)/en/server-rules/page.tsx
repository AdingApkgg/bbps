import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/server-rules/',
  title: 'Server Rules',
  description: 'Horsebean Private Server server rules and community guidelines'
})

export default function ServerRulesEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="serverRules" />
    </div>
  )
}
