import type { Metadata } from 'next'
import { MusicPage } from '@/components/music-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'music/',
  title: '音乐',
  description: '在线音乐播放器'
})

export default function MusicRoute() {
  return (
    <div className="overflow-x-hidden">
      <MusicPage />
    </div>
  )
}
