'use client'

import { useRef, useEffect, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Repeat1,
  Shuffle,
  Music,
  Loader2,
  Mic2,
  X,
  ArrowRight
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useMusicPlayer, useMusicTime } from '@/contexts/music-player-context'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DURATION_REVEAL, EASE_ENTRANCE, EASE_EXIT, useMotionDuration } from '@/components/motion'
import { cn } from '@/lib/utils'

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ── Seek Bar ── */

/* 播放进度与音量都走 @/components/ui/slider 的 compact 变体（轨道 2dp、手柄 12dp），
 * 不再手写 role="slider" 的 div —— Radix 自带方向键/Home/End、指针拖拽与 aria 属性。 */
function SeekBar({
  value,
  max,
  onChange,
  label,
  className
}: {
  value: number
  max: number
  onChange: (v: number) => void
  /** 无障碍名称 —— 这个组件同时用于播放进度和音量，读屏得能区分 */
  label: string
  className?: string
}) {
  return (
    <Slider
      compact
      aria-label={label}
      min={0}
      max={max}
      step={max / 100}
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      className={className}
    />
  )
}

/* ── Player Bar + Lyrics ── */

export function MusicPlayerBar() {
  /* 歌词是全屏浮层，走 M2 模态的 decelerate 进场 / accelerate 退场（长时长）；
    底部播放条是固定栏位，按揭幕处理：同样 240ms，但只做位移不淡入 */
  const overlayMs = useMotionDuration(DURATION_REVEAL)
  const locale = useLocale()
  const dict = getDictionary(locale)
  const player = useMusicPlayer()
  const { time, duration } = useMusicTime()

  const { currentTrack, playing, buffering, volume, mode, lyrics, lyricsLoading, showLyrics } =
    player

  const currentLineRef = useRef<HTMLButtonElement>(null)

  const currentLyricIdx = useMemo(() => {
    let idx = -1
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= time) idx = i
      else break
    }
    return idx
  }, [lyrics, time])

  // biome-ignore lint/correctness/useExhaustiveDependencies: 该依赖是触发器而非函数体读取的值，删掉会让 effect 只在挂载时跑一次
  useEffect(() => {
    currentLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentLyricIdx])

  /* Escape to close lyrics */
  useEffect(() => {
    if (!showLyrics) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') player.toggleLyrics()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showLyrics, player])

  const ModeIcon =
    mode === 'repeat-one'
      ? Repeat1
      : mode === 'shuffle'
        ? Shuffle
        : mode === 'repeat-all'
          ? Repeat
          : ArrowRight

  const modeLabel = {
    sequential: dict.music.sequential,
    'repeat-all': dict.music.repeatAll,
    'repeat-one': dict.music.repeatOne,
    shuffle: dict.music.shuffle
  }[mode]

  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  if (!currentTrack) return null

  return (
    <>
      {/* Lyrics full-screen overlay */}
      <AnimatePresence>
        {showLyrics && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: overlayMs, ease: EASE_EXIT } }}
            transition={{ duration: overlayMs, ease: EASE_ENTRANCE }}
            className="fixed inset-0 z-(--md-sys-layer-modal-full) flex flex-col bg-surface"
          >
            <div className="flex items-center justify-end p-4">
              <Button variant="ghost" size="icon" onClick={player.toggleLyrics}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 overflow-hidden px-4">
              {/* Cover */}
              <div className="size-40 flex-shrink-0 overflow-hidden bg-surface-variant-01 md:size-56">
                {currentTrack.pic ? (
                  /* biome-ignore lint/performance/noImgElement: 远程封面来自任意主机，next/image 在静态导出下不适用 */
                  <img src={currentTrack.pic} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Music className="size-12 text-on-surface-medium" />
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="text-center">
                <h2 className="text-title-lg font-normal">{currentTrack.name}</h2>
                <p className="text-body-02 text-on-surface-medium">{currentTrack.artist}</p>
              </div>

              {/* Lyrics scroll area */}
              <div className="flex-1 w-full max-w-lg overflow-y-auto mask-y-from-80% mask-y-to-80%">
                {lyricsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-on-surface-medium" />
                  </div>
                ) : lyrics.length === 0 ? (
                  <p className="py-8 text-center text-on-surface-medium">{dict.music.noLyrics}</p>
                ) : (
                  <div className="space-y-5 py-16 text-center">
                    {lyrics.map((line, i) => (
                      <button
                        type="button"
                        key={`${i}-${line.time}`}
                        ref={i === currentLyricIdx ? currentLineRef : undefined}
                        className={cn(
                          'w-full cursor-pointer transition-[background,box-shadow] duration-fast-02',
                          i === currentLyricIdx
                            ? 'text-body-02 font-medium text-on-surface'
                            : 'text-body-02 text-on-surface-medium/40 hover:text-on-surface-medium/70'
                        )}
                        onClick={() => player.seek(line.time)}
                      >
                        {line.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="border-t px-4 pb-6 pt-3">
              <SeekBar
                value={time}
                max={duration}
                onChange={player.seek}
                label={dict.music.seekLabel}
                className="mb-4"
              />
              <div className="flex items-center justify-center gap-4">
                <span className="w-12 text-right text-label tabular-nums text-on-surface-medium">
                  {formatTime(time)}
                </span>
                <Button variant="ghost" size="icon" className="size-10" onClick={player.prevTrack}>
                  <SkipBack className="size-5" />
                </Button>
                <Button
                  size="icon"
                  className="size-(--md-sys-size-control-2xl)"
                  onClick={player.togglePlay}
                >
                  {buffering ? (
                    <Loader2 className="size-7 animate-spin" />
                  ) : playing ? (
                    <Pause className="size-7" />
                  ) : (
                    <Play className="size-7" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="size-10" onClick={player.nextTrack}>
                  <SkipForward className="size-5" />
                </Button>
                <span className="w-12 text-label tabular-nums text-on-surface-medium">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Compact player bar */}
      <m.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: overlayMs, ease: EASE_ENTRANCE }}
        data-dock
        className="pointer-events-auto fixed inset-x-0 bottom-0 z-(--md-sys-layer-dock-player) border-t bg-surface"
      >
        <SeekBar
          value={time}
          max={duration}
          onChange={player.seek}
          label={dict.music.seekLabel}
          className="absolute -top-0.5 left-0 h-1 "
        />

        <div className="container-page flex items-center gap-3 py-2.5 md:gap-4">
          {/* Cover & info */}
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            onClick={player.toggleLyrics}
          >
            <div className="relative size-12 flex-shrink-0 overflow-hidden bg-surface-variant-01">
              {currentTrack.pic ? (
                /* biome-ignore lint/performance/noImgElement: 远程封面来自任意主机，next/image 在静态导出下不适用 */
                <img src={currentTrack.pic} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Music className="size-5 text-on-surface-medium" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-body-02 font-medium">{currentTrack.name}</p>
              <p className="truncate text-label text-on-surface-medium">{currentTrack.artist}</p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={player.prevTrack}
              title={dict.music.prevTrack}
            >
              <SkipBack className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={player.togglePlay}
              title={playing ? dict.music.pause : dict.music.play}
            >
              {buffering ? (
                <Loader2 className="size-5 animate-spin" />
              ) : playing ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={player.nextTrack}
              title={dict.music.nextTrack}
            >
              <SkipForward className="size-4" />
            </Button>
          </div>

          {/* Time */}
          <span className="hidden text-label tabular-nums text-on-surface-medium md:block">
            {formatTime(time)} / {formatTime(duration)}
          </span>

          {/* Lyrics toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn('hidden size-8 md:inline-flex', showLyrics && 'text-on-surface')}
            onClick={player.toggleLyrics}
            title={dict.music.lyrics}
          >
            <Mic2 className="size-4" />
          </Button>

          {/* Mode */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'hidden size-8 md:inline-flex',
              mode !== 'sequential' && 'text-on-surface'
            )}
            onClick={player.cycleMode}
            title={modeLabel}
          >
            <ModeIcon className="size-4" />
          </Button>

          {/* Volume */}
          <div className="hidden items-center gap-1 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => player.setVolume(volume === 0 ? 0.8 : 0)}
              title={dict.music.volume}
            >
              <VolIcon className="size-4" />
            </Button>
            <SeekBar
              value={volume}
              max={1}
              onChange={player.setVolume}
              label={dict.music.volumeLabel}
              className="w-20"
            />
          </div>
        </div>
      </m.div>
    </>
  )
}

export function PlayerSpacer() {
  const { currentTrack } = useMusicPlayer()
  return currentTrack ? <div className="h-[72px]" /> : null
}
