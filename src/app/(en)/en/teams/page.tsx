import type { Metadata } from 'next'
import { TeamsPage } from '@/components/teams-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/teams/',
  title: 'Our Team',
  description: 'Meet the people behind Horsebean Private Server — they make it all possible.'
})

export default function Teams() {
  return (
    <div className="overflow-x-hidden">
      <TeamsPage />
    </div>
  )
}
