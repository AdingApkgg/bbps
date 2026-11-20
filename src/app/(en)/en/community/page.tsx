import type { Metadata } from 'next'
import { CommunitySection } from '@/components/community-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/community/',
  title: 'Community',
  description: 'Join the Horsebean Private Server community and connect with other players'
})

export default function CommunityEnPage() {
  return (
    <div className="overflow-x-hidden">
      <CommunitySection />
    </div>
  )
}
