'use client'

import { ExternalLink } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'
import communityGroups from '@/data/community.json'

/* ── 平台 SVG 图标 ── */

function QQIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.395 15.035a39.548 39.548 0 0 0-1.293-3.168c0-.024.009-.036.009-.06V8.142A8.455 8.455 0 0 0 12 0a8.455 8.455 0 0 0-8.11 8.142v3.665c0 .024.009.036.009.06a39.548 39.548 0 0 0-1.293 3.168c-.463 1.363-.693 2.385-.493 2.865.2.48.916.402 1.752-.036a9.012 9.012 0 0 0 1.577-1.14c.492 1.012 1.171 1.86 2.003 2.5-.168.078-.33.162-.486.252-.744.432-1.224.954-1.068 1.164.156.21.948.06 1.692-.372a5.2 5.2 0 0 1 .48-.222A9.094 9.094 0 0 0 12 21.714a9.094 9.094 0 0 0 3.937-1.627c.156.072.312.15.48.222.744.432 1.536.582 1.692.372.156-.21-.324-.732-1.068-1.164a4.718 4.718 0 0 0-.486-.252c.832-.64 1.511-1.488 2.003-2.5a9.012 9.012 0 0 0 1.577 1.14c.836.438 1.552.516 1.752.036.2-.48-.03-1.502-.492-2.906z" />
    </svg>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const PLATFORM_ICONS: Record<string, React.FC<{ className?: string }>> = {
  qq: QQIcon,
  discord: DiscordIcon,
  telegram: TelegramIcon,
}

const PLATFORM_COLORS: Record<string, string> = {
  qq: 'text-blue-500',
  discord: 'text-indigo-500',
  telegram: 'text-sky-500',
}

export function CommunitySection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const d = dict.community

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="mt-2 text-muted-foreground">{d.subtitle}</p>
      </FadeIn>

      <div className="mt-10 grid gap-4">
        {communityGroups.map((group, i) => {
          const Icon = PLATFORM_ICONS[group.platform] ?? ExternalLink
          const color = PLATFORM_COLORS[group.platform] ?? 'text-muted-foreground'
          const meta = d.groups[group.id as keyof typeof d.groups]
          return (
            <FadeIn key={group.id} delay={0.1 + i * 0.05}>
              <Card>
                <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div>
                      <h2 className="font-semibold">{meta.name}</h2>
                      <p className="text-sm text-muted-foreground">{meta.desc}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full shrink-0 sm:w-auto" asChild>
                    <a href={group.url} target="_blank" rel="noopener noreferrer">
                      {d.join}
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
