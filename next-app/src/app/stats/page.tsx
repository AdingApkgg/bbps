import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { ServerStats } from '@/components/server-stats'

export const metadata: Metadata = {
  title: '在线玩家',
  description: '查看蚕豆私服实时在线人数和服务器状态',
  alternates: {
    canonical: `${SITE_URL}/stats/`,
    languages: { en: `${SITE_URL}/en/stats/` }
  },
  openGraph: {
    title: '在线玩家 | 蚕豆私服',
    description: '查看蚕豆私服实时在线人数和服务器状态',
    url: `${SITE_URL}/stats/`
  }
}

export default function StatsPage() {
  return (
    <div className="overflow-x-hidden">
      <ServerStats />
    </div>
  )
}
