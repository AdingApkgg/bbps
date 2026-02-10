import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { CommandsPage } from '@/components/commands-page'

export const metadata: Metadata = {
  title: 'Commands',
  description: 'In-game commands for Horsebean Private Server — find and generate commands easily',
  alternates: {
    canonical: `${SITE_URL}/en/commands/`,
    languages: { 'zh-CN': `${SITE_URL}/commands/` }
  },
  openGraph: {
    title: 'Commands | Horsebean Private Server',
    description: 'In-game commands for Horsebean Private Server — find and generate commands easily',
    url: `${SITE_URL}/en/commands/`,
    locale: 'en_US'
  }
}

export default function EnCommandsRoute() {
  return <CommandsPage />
}
