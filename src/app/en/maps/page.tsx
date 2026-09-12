import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CustomBasesPage } from '@/components/custom-bases-page'

const description =
  'Horsebean Private Server custom base library — search and download player-built bases, or open the map editor'

export const metadata: Metadata = {
  title: 'Custom Bases',
  description,
  alternates: {
    canonical: `${SITE_URL}/en/maps/`,
    languages: {
      zh: `${SITE_URL}/maps/`,
      en: `${SITE_URL}/en/maps/`,
      'x-default': `${SITE_URL}/en/maps/`
    }
  },
  openGraph: {
    title: 'Custom Bases | Horsebean Private Server',
    description,
    url: `${SITE_URL}/en/maps/`,
    locale: 'en_US'
  }
}

export default function MapsEnPage() {
  return (
    <div className="overflow-x-hidden">
      <CustomBasesPage />
    </div>
  )
}
