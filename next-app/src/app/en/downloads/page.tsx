import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { DownloadsSection } from '@/components/downloads-section'

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Download Horsebean Private Server client for Android and iOS',
  alternates: {
    canonical: `${SITE_URL}/en/downloads/`,
    languages: { 'zh-CN': `${SITE_URL}/downloads/` }
  },
  openGraph: {
    title: 'Downloads | Horsebean Private Server',
    description: 'Download Horsebean Private Server client for Android and iOS',
    url: `${SITE_URL}/en/downloads/`,
    locale: 'en_US'
  }
}

export default function DownloadsEnPage() {
  return (
    <div className="overflow-x-hidden">
      <DownloadsSection />
    </div>
  )
}
