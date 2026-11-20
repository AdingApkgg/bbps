import type { Metadata } from 'next'
import { MusicPage } from '@/components/music-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/music/',
  title: 'Music',
  description: 'Online music player'
})

export default function EnMusicRoute() {
  return (
    <div className="overflow-x-hidden">
      <MusicPage />
    </div>
  )
}
