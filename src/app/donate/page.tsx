import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'

export const metadata: Metadata = {
  title: '捐赠',
  description: '捐赠支持蚕豆私服',
  alternates: {
    canonical: `${SITE_URL}/donate/`,
    languages: { en: `${SITE_URL}/en/donate/` }
  },
  openGraph: {
    title: '捐赠 | 蚕豆私服',
    description: '捐赠支持蚕豆私服',
    url: `${SITE_URL}/donate/`
  }
}

export default function DonatePage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="donate" />
    </div>
  )
}
