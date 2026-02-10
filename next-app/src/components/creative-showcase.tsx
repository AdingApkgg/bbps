'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ASSETS } from '@/lib/assets'

const SLIDES = 4

export function CreativeShowcase() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((s) => (s < SLIDES - 1 ? s + 1 : 0))
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
  }

  return (
    <section className="container max-w-7xl space-y-8 px-4 py-12">
      <h2 className="text-center text-2xl font-semibold md:text-3xl">
        {dict.creative.title}
      </h2>

      <Card className="overflow-hidden">
        <div className="relative flex items-center gap-2 p-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            className="absolute left-4 z-10 shrink-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: SLIDES }, (_, i) => (
                <div key={i} className="aspect-video min-w-full">
                  <img
                    src={ASSETS.creativeSlides[i]}
                    alt={`魔改${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentSlide >= SLIDES - 1}
            onClick={() =>
              setCurrentSlide((s) => Math.min(SLIDES - 1, s + 1))
            }
            className="absolute right-4 z-10 shrink-0"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <p className="text-center text-muted-foreground">
        {dict.creative.description}
      </p>

      <div className="flex justify-center">
        <Button asChild>
          <a
            href="https://drive.30hb.cn/"
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
