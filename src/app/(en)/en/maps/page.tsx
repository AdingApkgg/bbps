import type { Metadata } from 'next'
import { CustomBasesPage } from '@/components/custom-bases-page'

import { pageMetadata } from '@/lib/seo'

const description =
  'Horsebean Private Server custom base library — search and download player-built bases, or open the map editor'

export const metadata: Metadata = pageMetadata({
  path: 'en/maps/',
  title: 'Custom Bases',
  description
})

export default function MapsEnPage() {
  return (
    <div className="overflow-x-hidden">
      <CustomBasesPage />
    </div>
  )
}
