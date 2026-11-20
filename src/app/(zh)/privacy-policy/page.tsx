import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'privacy-policy/',
  title: '隐私政策',
  description: '蚕豆私服隐私政策 — 了解我们如何处理您的数据'
})

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="privacy" />
    </div>
  )
}
