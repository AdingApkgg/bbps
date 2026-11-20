import type { Metadata } from 'next'
import { CommentsSection } from '@/components/comments-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'comments/',
  title: '评论',
  description: '蚕豆私服玩家社区评论区'
})

export default function CommentsPage() {
  return (
    <div className="overflow-x-hidden">
      <CommentsSection />
    </div>
  )
}
