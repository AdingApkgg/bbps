import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { TeamsPage } from '@/components/teams-page'

export const metadata: Metadata = {
  title: '团队成员',
  description: '认识蚕豆私服背后的团队——是他们让这一切成为可能。',
  alternates: {
    canonical: `${SITE_URL}/teams/`,
    languages: { en: `${SITE_URL}/en/teams/` }
  },
  openGraph: {
    title: '团队成员 | 蚕豆私服',
    description: '认识蚕豆私服背后的团队——是他们让这一切成为可能。',
    url: `${SITE_URL}/teams/`
  }
}

export default function Teams() {
  return (
    <div className="overflow-x-hidden">
      <TeamsPage />
    </div>
  )
}
