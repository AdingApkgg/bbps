'use client'

import { useState, useCallback } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ASSETS } from '@/lib/assets'

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
    <section className="container max-w-7xl space-y-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold md:text-3xl">{dict.maps.title}</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {dict.maps.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visibleIndices.map((index) => (
          <Card
            key={index}
            className="group overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-square">
              <img
                src={ASSETS.mapSlots[index]}
                alt={`地图${index + 1}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-medium text-white">♥ 0</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
        >
          {dict.maps.previous}
        </Button>
        <Button
          variant="outline"
          disabled={currentPage >= totalPages - 1}
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
          }
        >
          {dict.maps.next}
        </Button>
      </div>
    </section>
  )
}
