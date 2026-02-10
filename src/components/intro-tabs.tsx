'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Puzzle, Shield, Rocket } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'

const TAB_ICONS = [Puzzle, Shield, Rocket]

export function IntroTabs() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const prefix = locale === 'en' ? '/en' : ''

  const tabs = dict.intro.tabs
  const [active, setActive] = useState(0)

  /* 每个 tab 对应的 CTA 链接 */
  const ctaHrefs = [
    `${prefix}/downloads`,
    `${prefix}/commands`,
    `${prefix}/downloads`
  ]

  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
        {/* 标题 */}
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.intro.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {dict.intro.subtitle}
          </p>
        </FadeIn>

        {/* Tab 按钮 */}
        <FadeIn delay={0.2} className="mt-12 flex flex-wrap justify-center gap-3">
          {tabs.map((tab: { label: string }, i: number) => {
            const Icon = TAB_ICONS[i]
            const isActive = active === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${
                  isActive
                    ? 'border-foreground/20 bg-foreground text-background shadow-md'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </FadeIn>

        {/* Tab 内容 */}
        <div className="mx-auto mt-12 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="rounded-xl border bg-background p-8 shadow-sm md:p-10">
                <h3 className="text-xl font-semibold md:text-2xl">
                  {tabs[active].heading}
                </h3>
                <div className="mt-4 space-y-3 text-muted-foreground">
                  {(tabs[active].content as string)
                    .split('\n')
                    .map((line: string, j: number) => (
                      <p key={j}>{line}</p>
                    ))}
                </div>
                <Button className="mt-6" asChild>
                  <Link href={ctaHrefs[active]}>
                    {tabs[active].cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
