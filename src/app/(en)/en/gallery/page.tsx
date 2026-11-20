import type { Metadata } from 'next'
import { getGalleryImages } from '@/lib/gallery'
import { GalleryPage } from '@/components/gallery-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/gallery/',
  title: 'Gallery',
  description: 'Player-created base maps and creative works gallery'
})

export default async function EnGalleryRoute() {
  const images = await getGalleryImages()
  return (
    <div className="overflow-x-hidden">
      <GalleryPage images={images} />
    </div>
  )
}
