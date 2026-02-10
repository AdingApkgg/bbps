'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ASSETS } from '@/lib/assets'
import { FadeIn, Stagger, StaggerItem } from '@/components/motion'

const TOTAL_MAPS = 13
const MAPS_PER_PAGE = 12

export function MapsShowcase() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(TOTAL_MAPS / MAPS_PER_PAGE)
  const start = currentPage * MAPS_PER_PAGE
  const end = Math.min(start + MAPS_PER_PAGE, TOTAL_MAPS)
  const visibleIndices = Array.from({ length: end - start }, (_, i) => start + i)

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = 'none'
    },
    []
  )

  return (
    <section className="border-t bg-muted/30">
      <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {dict.maps.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{dict.maps.description}</p>
        </FadeIn>

        <Stagger className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" stagger={0.05}>
          {visibleIndices.map((index) => (
            <StaggerItem key={index}>
              <div className="group overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md">
                <div className="aspect-square">
                  <img
                    src={ASSETS.mapSlots[index]}
                    alt={`${locale === 'zh' ? '地图' : 'Map'} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {totalPages > 1 && (
          <FadeIn className="mt-8 flex items-center justify-center gap-2" delay={0.3}>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
