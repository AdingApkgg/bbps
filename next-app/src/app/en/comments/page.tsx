import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommentsSection } from '@/components/comments-section'

export const metadata: Metadata = {
  title: 'Comments',
  description: 'Community comments for Horsebean Private Server players',
  alternates: {
    canonical: `${SITE_URL}/en/comments/`,
    languages: { 'zh-CN': `${SITE_URL}/comments/` }
  },
  openGraph: {
    title: 'Comments | Horsebean Private Server',
    description: 'Community comments for Horsebean Private Server players',
    url: `${SITE_URL}/en/comments/`,
    locale: 'en_US'
  }
}

export default function EnCommentsPage() {
  return (
    <div className="overflow-x-hidden">
      <CommentsSection />
    </div>
  )
}
