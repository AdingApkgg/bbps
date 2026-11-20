import type { Metadata } from 'next'
import { CommandsPage } from '@/components/commands-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'commands/',
  title: '游戏指令',
  description: '蚕豆私服游戏内指令大全，快速查阅各类命令用法'
})

export default function CommandsRoute() {
  return <CommandsPage />
}
