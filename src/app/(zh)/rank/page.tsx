import type { Metadata } from 'next'
import { RankSection } from '@/components/rank-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'rank/',
  title: '排行榜',
  description: '蚕豆私服玩家排行榜 — VP、螃蟹、伤亡排名'
})

export default function RankPage() {
  return (
    <div className="overflow-x-hidden">
      <RankSection />
    </div>
  )
}
