import type { Metadata } from 'next'
import { ServerStats } from '@/components/server-stats'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/stats/',
  title: 'Online Players',
  description: 'View real-time online players and server status for Horsebean Private Server'
})

export default function EnStatsPage() {
  return (
    <div className="overflow-x-hidden">
      <ServerStats />
    </div>
  )
}
