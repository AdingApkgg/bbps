import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { DownloadsSection } from '@/components/downloads-section'

export const metadata: Metadata = {
  title: '下载',
  description: '下载蚕豆私服客户端，支持 Android 和 iOS',
  alternates: {
    canonical: `${SITE_URL}/downloads/`,
    languages: { en: `${SITE_URL}/en/downloads/` }
  },
  openGraph: {
    title: '下载 | 蚕豆私服',
    description: '下载蚕豆私服客户端，支持 Android 和 iOS',
    url: `${SITE_URL}/downloads/`
  }
}

export default function DownloadsPage() {
  return (
    <div className="overflow-x-hidden">
      <DownloadsSection />
    </div>
  )
}
