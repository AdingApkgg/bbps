import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { getGalleryImages } from '@/lib/gallery'
import { GalleryPage } from '@/components/gallery-page'

export const metadata: Metadata = {
  title: '图集',
  description: '蚕豆私服玩家创意基地地图与作品图集',
  alternates: {
    canonical: `${SITE_URL}/gallery/`,
    languages: { en: `${SITE_URL}/en/gallery/` }
  },
  openGraph: {
    title: `图集 | ${SITE_NAME}`,
    description: '蚕豆私服玩家创意基地地图与作品图集',
    url: `${SITE_URL}/gallery/`
  }
}

export default async function GalleryRoute() {
  const images = await getGalleryImages()
  return (
    <div className="overflow-x-hidden">
      <GalleryPage images={images} />
    </div>
  )
}
