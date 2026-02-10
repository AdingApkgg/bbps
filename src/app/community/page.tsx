import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommunitySection } from '@/components/community-section'

export const metadata: Metadata = {
  title: '社区',
  description: '加入蚕豆私服社区，与其他玩家交流',
  alternates: {
    canonical: `${SITE_URL}/community/`,
    languages: { en: `${SITE_URL}/en/community/` }
  },
  openGraph: {
    title: '社区 | 蚕豆私服',
    description: '加入蚕豆私服社区，与其他玩家交流',
    url: `${SITE_URL}/community/`
  }
}

export default function CommunityPage() {
  return (
    <div className="overflow-x-hidden">
      <CommunitySection />
    </div>
  )
}
