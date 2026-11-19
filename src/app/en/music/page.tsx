import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME_EN } from '@/lib/site'
import { MusicPage } from '@/components/music-page'

export const metadata: Metadata = {
  title: 'Music',
  description: 'Online music player',
  alternates: {
    canonical: `${SITE_URL}/en/music/`,
    languages: {
      zh: `${SITE_URL}/music/`,
      en: `${SITE_URL}/en/music/`,
      'x-default': `${SITE_URL}/en/music/`
    }
  },
  openGraph: {
    title: `Music | ${SITE_NAME_EN}`,
    description: 'Online music player',
    url: `${SITE_URL}/en/music/`,
    locale: 'en_US'
  }
}

export default function EnMusicRoute() {
  return (
    <div className="overflow-x-hidden">
      <MusicPage />
    </div>
  )
}
