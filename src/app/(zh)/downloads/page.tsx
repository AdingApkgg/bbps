import type { Metadata } from 'next'
import { DownloadsSection } from '@/components/downloads-section'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'downloads/',
  title: '下载',
  description: '下载蚕豆私服客户端，支持 Android 和 iOS'
})

export default function DownloadsPage() {
  return (
    <div className="overflow-x-hidden">
      <DownloadsSection />
    </div>
  )
}
