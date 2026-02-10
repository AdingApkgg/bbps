'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ASSETS } from '@/lib/assets'
import { FadeIn } from '@/components/motion'

const SLIDES = 4

export function CreativeShowcase() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setCurrent((s) => (s + 1) % SLIDES)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const go = useCallback(
    (dir: -1 | 1) => {
      setDirection(dir)
      setCurrent((s) => (s + dir + SLIDES) % SLIDES)
    },
    []
  )

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 })
  }

  return (
    <section className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {dict.creative.title}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {dict.creative.description}
        </p>
      </FadeIn>

      <div className="relative mx-auto mt-12 max-w-4xl">
        <div className="relative overflow-hidden rounded-lg border bg-muted">
          <div className="aspect-video">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                src={ASSETS.creativeSlides[current]}
                alt={`${locale === 'zh' ? '创意' : 'Creative'} ${current + 1}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={() => go(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: SLIDES }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1)
                setCurrent(i)
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current ? 'bg-foreground' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <a
            href="https://disk.saop.cc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.creative.explore}
          </a>
        </Button>
      </div>
    </section>
  )
}
