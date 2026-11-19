'use client'

import Link from 'next/link'
import {
  ChevronRight,
  Terminal,
  Map,
  HardDrive,
  MessageSquare,
  Trophy,
  BarChart3
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { FadeIn } from '@/components/motion'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  external?: boolean
}

/* 功能列表
 *
 * HIG 的分组列表：每行是一个去处，图标在左、标题与说明在左对齐的两行里，
 * 行尾一个 chevron 表示可跳转。整组一块容器，行间缩进分隔线。
 * 不用网格瓦片——瓦片是卡片语言的产物，列表才是 iOS 的导航语言。
 */
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
      title: dict.nav.maps,
      description: dict.cta.editorDescription,
      href: `${prefix}/maps`
    },
    {
      icon: <HardDrive className="h-5 w-5" />,
      title: dict.nav.drive,
      description:
        locale === 'zh'
          ? '访问网盘获取更多资源和工具'
          : 'Access the drive for more resources and tools',
      href: 'https://drive.saop.cc/%E7%99%BD%E9%B9%85%E7%BD%91%E7%9B%98',
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
    <section className="container-page py-16 md:py-24">
      <FadeIn>
        <h2 className="text-title-lg">{dict.cta.title}</h2>
        <p className="mt-1 text-body-02 text-on-surface-medium">{dict.hero.subtitle}</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-6">
        <ul data-list-group className="overflow-hidden rounded-sm bg-surface-02">
          {features.map((feature) => {
            const inner = (
              <>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-surface-variant-01 text-on-surface">
                  {feature.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body-01 font-semibold">{feature.title}</span>
                  <span className="block truncate text-label text-on-surface-medium">
                    {feature.description}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-on-surface-medium" />
              </>
            )

            const rowClass =
              'flex items-center gap-3 px-4 py-3 transition-colors duration-fast-02 hover:bg-surface-hover-01 active:bg-surface-pressed-01'

            return (
              <li key={feature.href} data-list-item>
                {feature.external ? (
                  <a
                    href={feature.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClass}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={feature.href} className={rowClass}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </FadeIn>
    </section>
  )
}
