import type { Metadata } from 'next'
import { TeamsPage } from '@/components/teams-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'teams/',
  title: '团队成员',
  description: '认识蚕豆私服背后的团队——是他们让这一切成为可能。'
})

export default function Teams() {
  return (
    <div className="overflow-x-hidden">
      <TeamsPage />
    </div>
  )
}
