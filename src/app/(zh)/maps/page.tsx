import type { Metadata } from 'next'
import { CustomBasesPage } from '@/components/custom-bases-page'

import { pageMetadata } from '@/lib/seo'

const description = '蚕豆私服玩家自制基地库 — 搜索、下载自制地图，或打开地图编辑器'

export const metadata: Metadata = pageMetadata({
  path: 'maps/',
  title: '自制地图',
  description
})

export default function MapsPage() {
  return (
    <div className="overflow-x-hidden">
      <CustomBasesPage />
    </div>
  )
}
