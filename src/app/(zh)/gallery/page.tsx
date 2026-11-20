import type { Metadata } from 'next'
import { getGalleryImages } from '@/lib/gallery'
import { GalleryPage } from '@/components/gallery-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'gallery/',
  title: '图集',
  description: '蚕豆私服玩家创意基地地图与作品图集'
})

export default async function GalleryRoute() {
  const images = await getGalleryImages()
  return (
    <div className="overflow-x-hidden">
      <GalleryPage images={images} />
    </div>
  )
}
