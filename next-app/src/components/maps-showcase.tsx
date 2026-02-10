"use client"

import { useState, useCallback } from "react"
import { useLocale } from "@/contexts/locale-context"
import { getDictionary } from "@/lib/i18n"

const TOTAL_MAPS = 13
const MAPS_PER_PAGE = 12
const ASSETS = "http://154.21.200.80:8889/png"

export function MapsShowcase() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = Math.ceil(TOTAL_MAPS / MAPS_PER_PAGE)
  const start = currentPage * MAPS_PER_PAGE
  const end = Math.min(start + MAPS_PER_PAGE, TOTAL_MAPS)
  const visibleIndices = Array.from({ length: end - start }, (_, i) => start + i)

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none"
  }, [])

  return (
    <section className="bg-white/30 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-3xl font-black text-[#2C2416] md:text-4xl">
          {dict.maps.title}
        </h2>
        <p className="mx-auto mb-12 max-w-[900px] text-center text-lg leading-relaxed text-[#5C5446]">
          {dict.maps.description}
        </p>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {visibleIndices.map((index) => (
            <button
              key={index}
              type="button"
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            >
              <img
                src={`${ASSETS}/%E5%9C%B0%E5%9B%BE${index + 1}.jpg`}
                alt={`地图${index + 1}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span aria-hidden>♥</span>
                  <span>0</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-8">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="relative min-h-[50px] min-w-[120px] cursor-pointer border-none bg-transparent transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[150px]"
          >
            <img
              src={`${ASSETS}/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png`}
              alt=""
              className="absolute inset-0 h-full w-full object-fill"
              aria-hidden
            />
            <span className="relative z-10 text-base font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
              {dict.maps.previous}
            </span>
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="relative min-h-[50px] min-w-[120px] cursor-pointer border-none bg-transparent transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[150px]"
          >
            <img
              src={`${ASSETS}/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png`}
              alt=""
              className="absolute inset-0 h-full w-full object-fill"
              aria-hidden
            />
            <span className="relative z-10 text-base font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
              {dict.maps.next}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
