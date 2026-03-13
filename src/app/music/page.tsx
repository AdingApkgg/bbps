import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { MusicPage } from '@/components/music-page'

export const metadata: Metadata = {
  title: '音乐',
  description: '在线音乐播放器',
  alternates: {
    canonical: `${SITE_URL}/music/`,
    languages: { en: `${SITE_URL}/en/music/` }
  },
  openGraph: {
    title: `音乐 | ${SITE_NAME}`,
    description: '在线音乐播放器',
    url: `${SITE_URL}/music/`
  }
}

export default function MusicRoute() {
  return (
    <div className="overflow-x-hidden">
      <MusicPage />
    </div>
  )
}
