'use client'

import { useState } from 'react'
import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
import { ArrowRight, Puzzle, Shield, Rocket } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  FadeIn,
  DURATION_DISCLOSURE,
  EASE_ENTRANCE,
  EASE_EXIT,
  useMotionDuration
} from '@/components/motion'

const TAB_ICONS = [Puzzle, Shield, Rocket]

export function IntroTabs() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''

  const tabs = dict.intro.tabs
  const [active, setActive] = useState(0)
  const tabMs = useMotionDuration(DURATION_DISCLOSURE)

  /* 每个 tab 对应的 CTA 链接 */
  const ctaHrefs = [`${prefix}/downloads`, `${prefix}/commands`, `${prefix}/downloads`]

  return (
    <section className="border-b bg-surface-01">
      <div className="container-page py-12 md:py-20">
        {/* 标题 */}
        <FadeIn>
          <h2 className="text-title-lg">{dict.intro.title}</h2>
          <p className="mt-1 text-body-02 text-on-surface-medium">{dict.intro.subtitle}</p>
        </FadeIn>

        {/* Tab 按钮 */}
        <FadeIn delay={0.2} className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab: { label: string }, i: number) => {
            const Icon = TAB_ICONS[i]
            const isActive = active === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`flex h-(--md-sys-size-control-lg) items-center gap-2 rounded-pill border px-4 text-button uppercase transition-colors duration-fast-02 ${
                  isActive
                    ? 'border-transparent bg-state-selected text-link-hover'
                    : 'border-outline-emphasis bg-transparent text-on-surface-medium hover:bg-state-hover hover:text-on-surface'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </FadeIn>

        {/* Tab 内容 */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <m.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: tabMs, ease: EASE_EXIT } }}
              transition={{
                duration: tabMs,
                ease: EASE_ENTRANCE
              }}
            >
              <div className="rounded-sm bg-surface-01 p-5">
                <h3 className="text-body-01 font-semibold">{tabs[active].heading}</h3>
                <div className="mt-2 space-y-2 text-body-02 text-on-surface-medium">
                  {(tabs[active].content as string).split('\n').map((line: string, j: number) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
                <Button className="mt-4" asChild>
                  <Link href={ctaHrefs[active]}>
                    {tabs[active].cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
