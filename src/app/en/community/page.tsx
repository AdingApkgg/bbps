import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommunitySection } from '@/components/community-section'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Horsebean Private Server community and connect with other players',
  alternates: {
    canonical: `${SITE_URL}/en/community/`,
    languages: { 'zh-CN': `${SITE_URL}/community/` }
  },
  openGraph: {
    title: 'Community | Horsebean Private Server',
    description: 'Join the Horsebean Private Server community and connect with other players',
    url: `${SITE_URL}/en/community/`,
    locale: 'en_US'
  }
}

export default function CommunityEnPage() {
  return (
    <div className="overflow-x-hidden">
      <CommunitySection />
    </div>
  )
}
