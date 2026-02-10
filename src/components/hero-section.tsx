'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ArrowRight, Play, X, Eye, Users } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useVisitorStats } from '@/hooks/use-visitor-stats'

const HERO_VIDEO_URL = 'https://r2.30hb.cn/hero.mp4'
const HERO_POSTER_URL = 'https://r2.30hb.cn/hero.avif'

/* ── 封面缩略图 + 播放按钮 ── */

function HeroPoster({
  className,
  onPlay
}: {
  className?: string
  onPlay: () => void
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onPlay}
        className="group relative block w-full overflow-hidden rounded-lg border bg-muted shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={HERO_POSTER_URL}
          alt="Video preview"
          className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* 播放图标 */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="h-7 w-7 fill-current text-foreground" />
          </span>
        </span>
      </button>
    </div>
  )
}

/* ── 视口居中的视频播放器遮罩 ── */

function VideoOverlay({ onClose }: { onClose: () => void }) {
  // ESC 关闭
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    // 锁定页面滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 text-white backdrop-blur-sm transition-colors hover:bg-background/40"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 播放器容器 */}
      <motion.div
        className="w-[90vw] max-w-4xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-lg shadow-2xl">
          <video
            className="w-full"
            src={HERO_VIDEO_URL}
            poster={HERO_POSTER_URL}
            controls
            autoPlay
            playsInline
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Hero Section ── */

export function HeroSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const downloadsHref = locale === 'en' ? '/en/downloads' : '/downloads'
  const commandsHref = locale === 'en' ? '/en/commands' : '/commands'

  const { sitePv, siteUv } = useVisitorStats()
  const [playing, setPlaying] = useState(false)
  const openPlayer = useCallback(() => setPlaying(true), [])
  const closePlayer = useCallback(() => setPlaying(false), [])

  return (
    <>
      <section className="relative overflow-hidden border-b">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/50" />

        <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
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
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
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

            {/* 视频封面 — 在副标题和按钮之间 */}
            <motion.div
              className="mx-auto mt-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <HeroPoster onPlay={openPlayer} />
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
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

            {/* 站点统计 */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{locale === 'zh' ? '访问' : 'Visits'}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {sitePv !== null ? sitePv.toLocaleString() : '-'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{locale === 'zh' ? '访客' : 'Visitors'}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {siteUv !== null ? siteUv.toLocaleString() : '-'}
                </span>
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 全屏播放器遮罩 */}
      <AnimatePresence>
        {playing && <VideoOverlay onClose={closePlayer} />}
      </AnimatePresence>
    </>
  )
}
