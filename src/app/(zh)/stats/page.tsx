import type { Metadata } from 'next'
import { ServerStats } from '@/components/server-stats'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'stats/',
  title: '在线玩家',
  description: '查看蚕豆私服实时在线人数和服务器状态'
})

export default function StatsPage() {
  return (
    <div className="overflow-x-hidden">
      <ServerStats />
    </div>
  )
}
