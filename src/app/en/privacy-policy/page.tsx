import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Horsebean Private Server privacy policy — learn how we handle your data',
  alternates: {
    canonical: `${SITE_URL}/en/privacy-policy/`,
    languages: {
      zh: `${SITE_URL}/privacy-policy/`,
      en: `${SITE_URL}/en/privacy-policy/`,
      'x-default': `${SITE_URL}/en/privacy-policy/`
    }
  },
  openGraph: {
    title: 'Privacy Policy | Horsebean Private Server',
    description: 'Horsebean Private Server privacy policy — learn how we handle your data',
    url: `${SITE_URL}/en/privacy-policy/`,
    locale: 'en_US'
  }
}

export default function PrivacyPolicyEnPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="en" legalKey="privacy" />
    </div>
  )
}
