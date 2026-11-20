import type { Metadata } from 'next'
import { CommentsSection } from '@/components/comments-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/comments/',
  title: 'Comments',
  description: 'Community comments for Horsebean Private Server players'
})

export default function EnCommentsPage() {
  return (
    <div className="overflow-x-hidden">
      <CommentsSection />
    </div>
  )
}
