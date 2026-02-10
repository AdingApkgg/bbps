"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocale } from "@/contexts/locale-context"
import { getDictionary } from "@/lib/i18n"

const ASSETS = "http://154.21.200.80:8889/png"
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
    e.currentTarget.style.display = "none"
  }

  return (
    <section className="bg-gradient-to-b from-white/50 to-white/80 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-black text-[#2C2416] md:text-5xl">
          {dict.creative.title}
        </h2>

        <div className="relative mx-auto mb-8 flex max-w-[1000px] items-center gap-8">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
            className="absolute left-2 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(8,145,209,0.9)] text-white transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 md:static md:left-0 md:h-12 md:w-12"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: SLIDES }, (_, i) => (
                <div key={i} className="aspect-video min-w-full">
                  <img
                    src={`${ASSETS}/%E9%AD%94%E6%94%B9${i + 1}.jpg`}
                    alt={`魔改${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={currentSlide >= SLIDES - 1}
            onClick={() => setCurrentSlide((s) => Math.min(SLIDES - 1, s + 1))}
            className="absolute right-2 z-10 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(8,145,209,0.9)] text-white transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 md:static md:right-0 md:h-12 md:w-12"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <p className="mx-auto mb-8 mt-8 text-center text-lg font-medium text-[#5C5446] md:text-xl">
          {dict.creative.description}
        </p>

        <a
          href="https://drive.30hb.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mx-auto flex min-h-[60px] min-w-[200px] cursor-pointer items-center justify-center no-underline transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98] md:min-w-[250px]"
        >
          <img
            src={`${ASSETS}/%E7%BB%BF%E8%89%B2%E6%8C%89%E9%92%AE.png`}
            alt=""
            className="absolute inset-0 h-full w-full object-fill"
            aria-hidden
          />
          <span className="relative z-10 text-lg font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
            {dict.creative.explore}
          </span>
        </a>
      </div>
    </section>
  )
}
