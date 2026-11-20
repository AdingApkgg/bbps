import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'donate/',
  title: '捐赠',
  description: '捐赠支持蚕豆私服'
})

export default function DonatePage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="donate" />
    </div>
  )
}
