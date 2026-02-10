import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'

export const metadata: Metadata = {
  title: '隐私政策',
  description: '蚕豆私服隐私政策 — 了解我们如何处理您的数据',
  alternates: {
    canonical: `${SITE_URL}/privacy-policy/`,
    languages: { en: `${SITE_URL}/en/privacy-policy/` }
  },
  openGraph: {
    title: '隐私政策 | 蚕豆私服',
    description: '蚕豆私服隐私政策 — 了解我们如何处理您的数据',
    url: `${SITE_URL}/privacy-policy/`
  }
}

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="privacy" />
    </div>
  )
}
