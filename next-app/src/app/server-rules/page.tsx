import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { LegalMdxPage } from '@/components/legal-mdx-page'

export const metadata: Metadata = {
  title: '服务器规则',
  description: '蚕豆私服服务器规则与社区公约',
  alternates: {
    canonical: `${SITE_URL}/server-rules/`,
    languages: { en: `${SITE_URL}/en/server-rules/` }
  },
  openGraph: {
    title: '服务器规则 | 蚕豆私服',
    description: '蚕豆私服服务器规则与社区公约',
    url: `${SITE_URL}/server-rules/`
  }
}

export default function ServerRulesPage() {
  return (
    <div className="overflow-x-hidden">
      <LegalMdxPage locale="zh" legalKey="serverRules" />
    </div>
  )
}
