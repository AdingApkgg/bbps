'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { FadeIn } from '@/components/motion'
import type { GalleryImage } from '@/lib/gallery'

interface GalleryPageProps {
  images: GalleryImage[]
}

function useMasonryColumns(containerRef: React.RefObject<HTMLDivElement | null>, gap: number) {
  const [cols, setCols] = useState(3)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w < 480) setCols(2)
      else if (w < 768) setCols(3)
      else setCols(4)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  return cols
}

export function GalleryPage({ images }: GalleryPageProps) {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const cols = useMasonryColumns(containerRef, 12)

  const markLoaded = useCallback((i: number) => {
    setLoaded((prev) => new Set(prev).add(i))
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev! + 1) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, images.length])

  // Distribute images into columns by shortest-column-first
  const columns: { img: GalleryImage; idx: number }[][] = Array.from({ length: cols }, () => [])
  const heights = new Array(cols).fill(0)

  for (let i = 0; i < images.length; i++) {
    const shortest = heights.indexOf(Math.min(...heights))
    columns[shortest].push({ img: images[i], idx: i })
    heights[shortest] += images[i].height / images[i].width
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">{dict.gallery.title}</h1>
        <p className="mt-4 text-muted-foreground">{dict.gallery.description}</p>
      </FadeIn>

      {/* Masonry grid */}
      <div ref={containerRef} className="mx-auto mt-12 flex max-w-6xl gap-3">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-3">
            {column.map(({ img, idx }) => (
                <button
                  key={img.src}
                  type="button"
                  className="group relative w-full overflow-hidden rounded-lg border bg-muted transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ aspectRatio: `${img.width} / ${img.height}` }}
                  onClick={() => setLightboxIndex(idx)}
                >
                  {/* Shimmer placeholder */}
                  {!loaded.has(idx) && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/5 to-muted" />
                  )}
                  <Image
                    src={img.src}
                    alt={`${dict.gallery.title} ${idx + 1}`}
                    width={img.width}
                    height={img.height}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onLoad={() => markLoaded(idx)}
                  />
                </button>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
        >
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].src}
              alt={`${dict.gallery.title} ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            <p className="mt-2 text-center text-sm text-white/70">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev! + 1) % images.length)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>

          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
            onClick={() => setLightboxIndex(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}
