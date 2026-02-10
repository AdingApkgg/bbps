import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { RankSection } from '@/components/rank-section'

export const metadata: Metadata = {
  title: 'Rankings',
  description: 'Horsebean Private Server player rankings — VP, Mega Crab, and Casualties leaderboards',
  alternates: {
    canonical: `${SITE_URL}/en/rank/`,
    languages: { 'zh-CN': `${SITE_URL}/rank/` }
  },
  openGraph: {
    title: 'Rankings | Horsebean Private Server',
    description: 'Horsebean Private Server player rankings — VP, Mega Crab, and Casualties leaderboards',
    url: `${SITE_URL}/en/rank/`,
    locale: 'en_US'
  }
}

export default function RankEnPage() {
  return (
    <div className="overflow-x-hidden">
      <RankSection />
    </div>
  )
}
