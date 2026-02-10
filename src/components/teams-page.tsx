'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'
import teamData from '@/data/teams.json'

export function TeamsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {dict.teams.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {dict.teams.subtitle}
        </p>
      </FadeIn>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamData.map((member) => {
          const info =
            dict.teams.members[member.id as keyof typeof dict.teams.members]
          if (!info) return null

          return (
            <StaggerItem key={member.id}>
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-border transition-all group-hover:ring-primary">
                      <Image
                        src={member.avatar}
                        alt={info.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <h3 className="text-lg font-semibold">{info.name}</h3>

                    <Badge variant="secondary" className="mt-1.5">
                      {info.role}
                    </Badge>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {info.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      <ExternalLink className="h-3 w-3" />
                      <span>
                        {member.platform === 'bilibili'
                          ? 'Bilibili'
                          : 'QQ'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
