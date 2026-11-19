'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ArrowRight, Play, X, Eye, Users } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useVisitorStats } from '@/hooks/use-visitor-stats'
import { ASSETS } from '@/lib/assets'
import { DURATION_REVEAL, EASE_ENTRANCE, EASE_EXIT, useMotionDuration } from '@/components/motion'

const HERO_VIDEO_URL = 'https://r2.30hb.cn/hero.mp4'
const HERO_POSTER_URL = ASSETS.heroPoster

/* ── 封面缩略图 + 播放按钮 ── */

function HeroPoster({ className, onPlay }: { className?: string; onPlay: () => void }) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onPlay}
        className="group relative block w-full overflow-hidden rounded-sm bg-surface-variant-01 "
      >
        {/*
 priority：这张图在首屏正中，多半就是 LCP 元素。next/image 默认
 loading="lazy"，要等交叉观察器触发才开始下载，白白推迟 LCP。
 priority 会改成 eager + fetchpriority=high 并预加载。
 */}
        <Image
          src={HERO_POSTER_URL}
          alt="Video preview"
          width={1280}
          height={720}
          priority
          className="w-full transition-transform duration-moderate-01 ease-standard group-hover:scale-[1.02]"
        />
        {/* 播放图标 */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center bg-surface transition-transform duration-fast-02 ease-standard group-hover:scale-110">
            <Play className="h-7 w-7 fill-current text-on-surface" />
          </span>
        </span>
      </button>
    </div>
  )
}

/* ── 视口居中的视频播放器遮罩 ── */

function VideoOverlay({ onClose }: { onClose: () => void }) {
  /* 遮罩与播放器都是模态：M2 的模态用 decelerate 进场、accelerate 退场且走长时长，
     不用 fast —— 它是整屏浮层，110ms 太快像抽搐 */
  const overlayMs = useMotionDuration(DURATION_REVEAL)
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
      className="fixed inset-0 z-(--md-sys-layer-modal-full) flex items-center justify-center bg-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: overlayMs, ease: EASE_EXIT } }}
      transition={{ duration: overlayMs, ease: EASE_ENTRANCE }}
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-scrim/60 text-on-primary transition-colors duration-fast-01 hover:bg-scrim"
      >
        <X className="h-5 w-5" />
      </button>

      {/* 播放器容器 */}
      <motion.div
        className="w-[90vw] max-w-4xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0, transition: { duration: overlayMs, ease: EASE_EXIT } }}
        transition={{ duration: overlayMs, ease: EASE_ENTRANCE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden">
          {/* biome-ignore lint/a11y/useMediaCaption: 游戏实录画面，只有背景音乐没有对白 */}
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
  const revealMs = useMotionDuration(DURATION_REVEAL)
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
        {/* 网格底纹：用 8% 的分隔色逐格 1 格 1 线 */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--md-sys-color-outline-01)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--md-sys-color-outline-01)_50%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface via-surface to-surface-01" />

        <div className="container-page py-12 md:py-20 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <motion.p
                className="text-body-02 font-medium text-on-surface-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: revealMs, ease: EASE_ENTRANCE }}
              >
                {dict.hero.welcome}
              </motion.p>

              <motion.h1
                className="mt-2 text-display-md sm:text-display-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: revealMs, ease: EASE_ENTRANCE, delay: 0.04 }}
              >
                {dict.site.name}
              </motion.h1>

              <motion.p
                className="mt-3 max-w-prose text-title-lg text-on-surface-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: revealMs, ease: EASE_ENTRANCE, delay: 0.08 }}
              >
                {dict.hero.subtitle}
              </motion.p>

              <motion.div
                className="mt-6 flex flex-col gap-3 sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: revealMs, ease: EASE_ENTRANCE, delay: 0.12 }}
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
                className="mt-6 flex items-center gap-6 text-body-02 text-on-surface-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: revealMs, ease: EASE_ENTRANCE, delay: 0.16 }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{locale === 'zh' ? '访问' : 'Visits'}</span>
                  <span className="font-semibold tabular-nums text-on-surface">
                    {sitePv !== null ? sitePv.toLocaleString() : '-'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{locale === 'zh' ? '访客' : 'Visitors'}</span>
                  <span className="font-semibold tabular-nums text-on-surface">
                    {siteUv !== null ? siteUv.toLocaleString() : '-'}
                  </span>
                </span>
              </motion.div>
            </div>

            {/* 视频封面 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: revealMs, ease: EASE_ENTRANCE, delay: 0.12 }}
            >
              <HeroPoster onPlay={openPlayer} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 全屏播放器遮罩 */}
      <AnimatePresence>{playing && <VideoOverlay onClose={closePlayer} />}</AnimatePresence>
    </>
  )
}
