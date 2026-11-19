import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommentsSection } from '@/components/comments-section'

export const metadata: Metadata = {
  title: '评论',
  description: '蚕豆私服玩家社区评论区',
  alternates: {
    canonical: `${SITE_URL}/comments/`,
    languages: {
      zh: `${SITE_URL}/comments/`,
      en: `${SITE_URL}/en/comments/`,
      'x-default': `${SITE_URL}/en/comments/`
    }
  },
  openGraph: {
    title: '评论 | 蚕豆私服',
    description: '蚕豆私服玩家社区评论区',
    url: `${SITE_URL}/comments/`
  }
}

export default function CommentsPage() {
  return (
    <div className="overflow-x-hidden">
      <CommentsSection />
    </div>
  )
}
