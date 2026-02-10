'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

const HERO_VIDEO_URL = 'https://r2.30hb.cn/hero.mp4'
const HERO_POSTER_URL = 'https://r2.30hb.cn/hero.avif'

function HeroVideo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-lg border bg-muted shadow-lg">
        <video
          className="w-full"
          src={HERO_VIDEO_URL}
          poster={HERO_POSTER_URL}
          controls
          playsInline
        />
      </div>
    </div>
  )
}

export function HeroSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const downloadsHref = locale === 'en' ? '/en/downloads' : '/downloads'
  const commandsHref = locale === 'en' ? '/en/commands' : '/commands'

  return (
    <section className="relative overflow-hidden border-b">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/50" />

      <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Video — desktop left */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroVideo />
          </motion.div>

          {/* Text — desktop right */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                {dict.hero.welcome}
              </p>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {dict.site.name}
            </motion.h1>

            <motion.p
              className="mt-4 text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {dict.hero.subtitle}
            </motion.p>

            {/* Video — mobile only, between subtitle and buttons */}
            <motion.div
              className="mt-8 md:hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <HeroVideo />
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" asChild>
                <Link href={downloadsHref}>
                  <Download className="mr-2 h-4 w-4" />
                  {dict.hero.download}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={commandsHref}>
                  {dict.cta.viewCommands}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
