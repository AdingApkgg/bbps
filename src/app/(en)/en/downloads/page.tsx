import type { Metadata } from 'next'
import { DownloadsSection } from '@/components/downloads-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/downloads/',
  title: 'Downloads',
  description: 'Download Horsebean Private Server client for Android and iOS'
})

export default function DownloadsEnPage() {
  return (
    <div className="overflow-x-hidden">
      <DownloadsSection />
    </div>
  )
}
