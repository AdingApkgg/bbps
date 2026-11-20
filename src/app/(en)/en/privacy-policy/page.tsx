import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/privacy-policy/',
  title: 'Privacy Policy',
  description: 'Horsebean Private Server privacy policy — learn how we handle your data'
})

export default function PrivacyPolicyEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="privacy" />
    </div>
  )
}
