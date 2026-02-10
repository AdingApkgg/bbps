'use client'

import Link from 'next/link'
import {
  Terminal,
  Map,
  HardDrive,
  MessageSquare,
  Trophy,
  BarChart3
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  external?: boolean
}

export function CtaSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''

  const features: FeatureItem[] = [
    {
      icon: <Terminal className="h-5 w-5" />,
      title: dict.nav.commands,
      description: dict.cta.description,
      href: `${prefix}/commands`
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: dict.nav.editor,
      description: dict.cta.editorDescription,
      href: 'https://webapi.30hb.cn/basebuilder/Layout-Builder.htm',
      external: true
    },
    {
      icon: <HardDrive className="h-5 w-5" />,
      title: dict.nav.drive,
      description:
        locale === 'zh'
          ? '访问网盘获取更多资源和工具'
          : 'Access the drive for more resources and tools',
      href: 'https://drive.30hb.cn/',
      external: true
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: dict.nav.rank,
      description: dict.rank?.subtitle ?? '',
      href: `${prefix}/rank`
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: dict.nav.stats,
      description:
        locale === 'zh'
          ? '查看服务器实时在线玩家和统计数据'
          : 'View real-time online players and server statistics',
      href: `${prefix}/stats`
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: dict.nav.comments,
      description:
        locale === 'zh'
          ? '加入社区讨论，分享你的游戏体验'
          : 'Join the community discussion and share your experience',
      href: `${prefix}/comments`
    }
  ]

  return (
    <section className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {dict.cta.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{dict.hero.subtitle}</p>
      </FadeIn>

      <Stagger className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const content = (
            <Card className="group h-full transition-colors hover:bg-muted/50">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          )

          if (feature.external) {
            return (
              <StaggerItem key={feature.href}>
                <a
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {content}
                </a>
              </StaggerItem>
            )
          }

          return (
            <StaggerItem key={feature.href}>
              <Link href={feature.href} className="block h-full">
                {content}
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
