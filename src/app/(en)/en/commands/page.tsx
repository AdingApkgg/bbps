import type { Metadata } from 'next'
import { CommandsPage } from '@/components/commands-page'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: 'en/commands/',
  title: 'Commands',
  description: 'In-game commands for Horsebean Private Server — find and generate commands easily'
})

export default function EnCommandsRoute() {
  return <CommandsPage />
}
