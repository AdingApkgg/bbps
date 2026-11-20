import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/donate/',
  title: 'Donate',
  description: 'Support Horsebean Private Server with a donation'
})

export default function DonateEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="donate" />
    </div>
  )
}
