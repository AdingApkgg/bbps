import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommandsPage } from '@/components/commands-page'

export const metadata: Metadata = {
  title: '游戏指令',
  description: '蚕豆私服游戏内指令大全，快速查阅各类命令用法',
  alternates: {
    canonical: `${SITE_URL}/commands/`,
    languages: { en: `${SITE_URL}/en/commands/` }
  },
  openGraph: {
    title: '游戏指令 | 蚕豆私服',
    description: '蚕豆私服游戏内指令大全，快速查阅各类命令用法',
    url: `${SITE_URL}/commands/`
  }
}

export default function CommandsRoute() {
  return <CommandsPage />
}
