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
 <section className="container-page max-w-4xl py-16 md:py-24">
 <FadeIn eager className="mx-auto max-w-2xl text-center">
 <h1 className="text-headline-md font-normal sm:text-headline-lg">{dict.teams.title}</h1>
 <p className="mt-4 text-body-02 text-on-surface-medium">{dict.teams.subtitle}</p>
 </FadeIn>

 <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {teamData.map((member) => {
 const info = dict.teams.members[member.id as keyof typeof dict.teams.members]
 if (!info) return null

 return (
 <StaggerItem key={member.id}>
 <a
 href={member.link}
 target="_blank"
 rel="noopener noreferrer"
 className="group block h-full"
 >
 <Card className="h-full border border-transparent transition-colors duration-fast-01 hover:border-outline-emphasis">
 <CardContent className="flex flex-col items-center p-6 text-center">
 <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border border-outline transition-colors duration-fast-01 group-hover:border-outline-active">
 <Image
 src={member.avatar}
 alt={info.name}
 fill
 className="object-cover"
 sizes="96px"
 />
 </div>

 <h3 className="text-body-02 font-medium">{info.name}</h3>

 <Badge variant="secondary" className="mt-1.5">
 {info.role}
 </Badge>

 <p className="mt-3 text-body-02 leading-relaxed text-on-surface-medium">
 {info.description}
 </p>

 <div className="mt-4 flex items-center gap-1 text-label text-on-surface-medium opacity-0 transition-opacity duration-fast-01 group-hover:opacity-100">
 <ExternalLink className="h-3 w-3" />
 <span>{member.platform === 'bilibili' ? 'Bilibili' : 'QQ'}</span>
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
