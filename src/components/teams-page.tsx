'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { FadeIn } from '@/components/motion'
import teamData from '@/data/teams.json'

/**
 * 成员页用分组列表，不用卡片网格：
 * 6 个人用三列格子会把每张卡压成方形留白，读起来是 6 个孤岛；
 * 列表一行一个人、头像与名字同一基线，扫视成本更低。
 */
export function TeamsPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <section className="container-page max-w-4xl pt-8 pb-16 md:pt-12 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{dict.teams.title}</h1>
        <p className="mt-1 text-headline-sm text-on-surface-medium">{dict.teams.subtitle}</p>
      </FadeIn>

      <ul data-list-group className="mt-6 overflow-hidden rounded-sm bg-surface-02">
        {teamData.map((member) => {
          const info = dict.teams.members[member.id as keyof typeof dict.teams.members]
          if (!info) return null

          return (
            <li key={member.id} data-list-item>
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 transition-colors duration-fast-02 hover:bg-surface-hover-01 active:bg-surface-pressed-01 sm:gap-4"
              >
                <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-variant-01">
                  <Image src={member.avatar} alt="" fill className="object-cover" sizes="44px" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-01 font-semibold">{info.name}</span>
                  <span className="mt-0.5 block text-label text-on-surface-medium">
                    {info.role}
                    <span className="mx-2 opacity-50">·</span>
                    {member.platform === 'bilibili' ? 'Bilibili' : 'QQ'}
                  </span>
                  <span className="mt-1 line-clamp-2 text-body-02 sm:line-clamp-1 text-on-surface-medium">
                    {info.description}
                  </span>
                </span>

                <ChevronRight className="size-4 shrink-0 text-on-surface-medium" aria-hidden />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
