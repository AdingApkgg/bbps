'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Puzzle, Shield, Rocket } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { FadeIn, DURATION_DISCLOSURE, EASE_ENTRANCE, EASE_EXIT, useMotionDuration } from '@/components/motion'

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
 <div className="container-m2 py-16 md:py-24">
 {/* 标题 */}
 <FadeIn className="mx-auto max-w-3xl text-center">
 <h2 className="text-headline-md font-normal sm:text-headline-lg">{dict.intro.title}</h2>
 <p className="mt-4 text-body-02 text-on-surface-medium">{dict.intro.subtitle}</p>
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
 className={`flex h-10 items-center gap-2 rounded-pill border px-4 text-button uppercase transition-colors duration-fast-02 ${
 isActive
 ? 'border-transparent bg-state-selected text-link'
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
 <div className="mx-auto mt-12 max-w-2xl">
 <AnimatePresence mode="wait">
 <motion.div
 key={active}
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -16, transition: { duration: tabMs, ease: EASE_EXIT } }}
 transition={{
 duration: tabMs,
 ease: EASE_ENTRANCE
 }}
 >
 <div className="rounded-sm bg-surface-01 shadow-sm p-8 md:p-10">
 <h3 className="text-title-lg font-medium md:text-headline-md">{tabs[active].heading}</h3>
 <div className="mt-4 space-y-3 text-on-surface-medium">
 {(tabs[active].content as string).split('\n').map((line: string, j: number) => (
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
