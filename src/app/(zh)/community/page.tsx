import type { Metadata } from 'next'
import { CommunitySection } from '@/components/community-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'community/',
  title: '社区',
  description: '加入蚕豆私服社区，与其他玩家交流'
})

export default function CommunityPage() {
  return (
    <div className="overflow-x-hidden">
      <CommunitySection />
    </div>
  )
}
