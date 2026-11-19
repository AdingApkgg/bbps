import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CustomBasesPage } from '@/components/custom-bases-page'

const description = '蚕豆私服玩家自制基地库 — 搜索、下载自制地图，或打开地图编辑器'

export const metadata: Metadata = {
  title: '自制地图',
  description,
  alternates: {
    canonical: `${SITE_URL}/maps/`,
    languages: {
      zh: `${SITE_URL}/maps/`,
      en: `${SITE_URL}/en/maps/`,
      'x-default': `${SITE_URL}/en/maps/`
    }
  },
  openGraph: {
    title: '自制地图 | 蚕豆私服',
    description,
    url: `${SITE_URL}/maps/`
  }
}

export default function MapsPage() {
  return (
    <div className="overflow-x-hidden">
      <CustomBasesPage />
    </div>
  )
}
