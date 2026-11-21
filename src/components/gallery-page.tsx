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

function useMasonryColumns(containerRef: React.RefObject<HTMLDivElement | null>, _gap: number) {
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
      if (e.key === 'ArrowLeft')
        setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)
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
    <div className="container-page pt-8 pb-16 md:pt-12 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{dict.gallery.title}</h1>
        <p className="mt-1 text-headline-sm text-on-surface-medium">{dict.gallery.description}</p>
      </FadeIn>

      {/* Masonry grid */}
      <div ref={containerRef} className="mt-6 flex gap-2">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-3">
            {column.map(({ img, idx }) => (
              <button
                key={img.src}
                type="button"
                className="group relative w-full overflow-hidden border bg-surface-variant-01 transition-colors duration-fast-01 hover:border-outline-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Shimmer placeholder */}
                {!loaded.has(idx) && <div className="absolute inset-0 skeleton-sweep" />}
                {/*
 sizes 与 useMasonryColumns 的分栏一致：<480 两栏、<768 三栏、其余四栏，
 每栏之间 gap-2 —— 写错的话浏览器会挑到不合尺寸的档位，白传大图。
 */}
                <Image
                  src={img.src}
                  alt={`${dict.gallery.title} ${idx + 1}`}
                  width={img.width}
                  height={img.height}
                  sizes="(max-width: 479px) 48vw, (max-width: 767px) 32vw, 24vw"
                  className="h-full w-full object-contain transition-transform duration-moderate-01 ease-standard group-hover:scale-105"
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
          className="fixed inset-0 z-(--hig-layer-modal-full) flex items-center justify-center bg-scrim"
          role="dialog"
          aria-modal="true"
          aria-label={dict.gallery.viewer}
        >
          {/*
 遮罩做成独立的绝对定位按钮，而不是给外层 div 挂 onClick：
 后者对键盘用户不可达，而且要靠内容层 stopPropagation 才不会误关。
 */}
          <button
            type="button"
            aria-label={dict.gallery.close}
            className="absolute inset-0 cursor-default"
            onClick={() => setLightboxIndex(null)}
          />
          <button
            type="button"
            aria-label={dict.gallery.prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface p-2 text-on-surface transition-colors duration-fast-01 hover:bg-surface-hover-01"
            onClick={() => setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length)}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw]">
            {/*
 灯箱用原生 img：尺寸由 max-h-[85vh] 决定，next/image 拿不到具体像素值，
 会按 width 属性算出一堆用不上的档位。这里直接给出 srcSet，最大档到 1600。
 */}
            {/* biome-ignore lint/performance/noImgElement: 灯箱尺寸由 CSS 上限决定，next/image 无法推算档位 */}
            <img
              src={images[lightboxIndex].src}
              srcSet={`${images[lightboxIndex].src} 1600w`}
              alt={`${dict.gallery.title} ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            <p className="mt-2 text-center text-body-02 text-on-primary/70">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          <button
            type="button"
            aria-label={dict.gallery.next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface p-2 text-on-surface transition-colors duration-fast-01 hover:bg-surface-hover-01"
            onClick={() => setLightboxIndex((prev) => (prev! + 1) % images.length)}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={dict.gallery.close}
            className="absolute right-4 top-4 bg-surface p-2 text-on-surface transition-colors duration-fast-01 hover:bg-surface-hover-01"
            onClick={() => setLightboxIndex(null)}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
