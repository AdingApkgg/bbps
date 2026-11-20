import type { Metadata } from 'next'
import { RankSection } from '@/components/rank-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/rank/',
  title: 'Rankings',
  description:
    'Horsebean Private Server player rankings — VP, Mega Crab, and Casualties leaderboards'
})

export default function RankEnPage() {
  return (
    <div className="overflow-x-hidden">
      <RankSection />
    </div>
  )
}
