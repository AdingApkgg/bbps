import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { RankSection } from '@/components/rank-section'

export const metadata: Metadata = {
  title: '排行榜',
  description: '蚕豆私服玩家排行榜 — VP、螃蟹、伤亡排名',
  alternates: {
    canonical: `${SITE_URL}/rank/`,
    languages: { en: `${SITE_URL}/en/rank/` }
  },
  openGraph: {
    title: '排行榜 | 蚕豆私服',
    description: '蚕豆私服玩家排行榜 — VP、螃蟹、伤亡排名',
    url: `${SITE_URL}/rank/`
  }
}

export default function RankPage() {
  return (
    <div className="overflow-x-hidden">
      <RankSection />
    </div>
  )
}
