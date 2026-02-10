import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { TeamsPage } from '@/components/teams-page'

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the people behind Horsebean Private Server — they make it all possible.',
  alternates: {
    canonical: `${SITE_URL}/en/teams/`,
    languages: { zh: `${SITE_URL}/teams/` }
  },
  openGraph: {
    title: 'Our Team | Horsebean Private Server',
    description:
      'Meet the people behind Horsebean Private Server — they make it all possible.',
    url: `${SITE_URL}/en/teams/`
  }
}

export default function Teams() {
  return (
    <div className="overflow-x-hidden">
      <TeamsPage />
    </div>
  )
}
