import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { ServerStats } from '@/components/server-stats'

export const metadata: Metadata = {
  title: 'Online Players',
  description: 'View real-time online players and server status for Horsebean Private Server',
  alternates: {
    canonical: `${SITE_URL}/en/stats/`,
    languages: { 'zh-CN': `${SITE_URL}/stats/` }
  },
  openGraph: {
    title: 'Online Players | Horsebean Private Server',
    description: 'View real-time online players and server status for Horsebean Private Server',
    url: `${SITE_URL}/en/stats/`,
    locale: 'en_US'
  }
}

export default function EnStatsPage() {
  return (
    <div className="overflow-x-hidden">
      <ServerStats />
    </div>
  )
}
