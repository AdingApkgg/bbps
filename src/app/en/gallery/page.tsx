import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME_EN } from '@/lib/site'
import { getGalleryImages } from '@/lib/gallery'
import { GalleryPage } from '@/components/gallery-page'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Player-created base maps and creative works gallery',
  alternates: {
    canonical: `${SITE_URL}/en/gallery/`,
    languages: { 'zh-CN': `${SITE_URL}/gallery/` }
  },
  openGraph: {
    title: `Gallery | ${SITE_NAME_EN}`,
    description: 'Player-created base maps and creative works gallery',
    url: `${SITE_URL}/en/gallery/`,
    locale: 'en_US'
  }
}

export default async function EnGalleryRoute() {
  const images = await getGalleryImages()
  return (
    <div className="overflow-x-hidden">
      <GalleryPage images={images} />
    </div>
  )
}
