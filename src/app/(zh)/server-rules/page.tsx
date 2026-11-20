import type { Metadata } from 'next'
import { LegalMdxPage } from '@/components/legal-mdx-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'server-rules/',
  title: '服务器规则',
  description: '蚕豆私服服务器规则与社区公约'
})

export default function ServerRulesPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="serverRules" />
    </div>
  )
}
