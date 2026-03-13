'use client'

import { useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Volume1,
  Repeat, Repeat1, Shuffle,
  Music, Loader2, Mic2, X, ArrowRight
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useMusicPlayer, useMusicTime } from '@/contexts/music-player-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/* ── Seek Bar ── */

function SeekBar({ value, max, onChange, className }: {
  value: number
  max: number
  onChange: (v: number) => void
  className?: string
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  const calc = useCallback((clientX: number) => {
    const el = barRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    onChange(ratio * max)
  }, [max, onChange])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) calc(e.clientX) }
    const onUp = () => { dragging.current = false }
    const onTouchMove = (e: TouchEvent) => { if (dragging.current) calc(e.touches[0].clientX) }
    const onTouchEnd = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [calc])

  return (
    <div
      ref={barRef}
      className={cn('group relative h-1.5 w-full cursor-pointer rounded-full bg-muted', className)}
      onMouseDown={(e) => { dragging.current = true; calc(e.clientX) }}
      onTouchStart={(e) => { dragging.current = true; calc(e.touches[0].clientX) }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        style={{ left: `calc(${pct}% - 6px)` }}
      />
    </div>
  )
}

/* ── Player Bar + Lyrics ── */

export function MusicPlayerBar() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const player = useMusicPlayer()
  const { time, duration } = useMusicTime()

  const {
    currentTrack, playing, buffering, volume, mode,
    lyrics, lyricsLoading, showLyrics
  } = player

  const currentLineRef = useRef<HTMLParagraphElement>(null)

  const currentLyricIdx = useMemo(() => {
    let idx = -1
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= time) idx = i
      else break
    }
    return idx
  }, [lyrics, time])

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

  const ModeIcon = mode === 'repeat-one' ? Repeat1
    : mode === 'shuffle' ? Shuffle
      : mode === 'repeat-all' ? Repeat
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-background/98 backdrop-blur-xl"
          >
            <div className="flex items-center justify-end p-4">
              <Button variant="ghost" size="icon" onClick={player.toggleLyrics}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 overflow-hidden px-4">
              {/* Cover */}
              <div className="size-40 flex-shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg md:size-56">
                {currentTrack.pic ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={currentTrack.pic} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Music className="size-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="text-center">
                <h2 className="text-xl font-bold">{currentTrack.name}</h2>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </div>

              {/* Lyrics scroll area */}
              <div className="flex-1 w-full max-w-lg overflow-y-auto mask-y-from-80% mask-y-to-80%">
                {lyricsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : lyrics.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    {dict.music.noLyrics}
                  </p>
                ) : (
                  <div className="space-y-5 py-16 text-center">
                    {lyrics.map((line, i) => (
                      <p
                        key={`${i}-${line.time}`}
                        ref={i === currentLyricIdx ? currentLineRef : undefined}
                        className={cn(
                          'cursor-pointer transition-all duration-300',
                          i === currentLyricIdx
                            ? 'text-lg font-semibold text-foreground'
                            : 'text-sm text-muted-foreground/40 hover:text-muted-foreground/70'
                        )}
                        onClick={() => player.seek(line.time)}
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="border-t px-4 pb-6 pt-3">
              <SeekBar value={time} max={duration} onChange={player.seek} className="mb-4" />
              <div className="flex items-center justify-center gap-4">
                <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                  {formatTime(time)}
                </span>
                <Button variant="ghost" size="icon" className="size-10" onClick={player.prevTrack}>
                  <SkipBack className="size-5" />
                </Button>
                <Button
                  size="icon"
                  className="size-14 rounded-full"
                  onClick={player.togglePlay}
                >
                  {buffering
                    ? <Loader2 className="size-7 animate-spin" />
                    : playing
                      ? <Pause className="size-7" />
                      : <Play className="size-7" />}
                </Button>
                <Button variant="ghost" size="icon" className="size-10" onClick={player.nextTrack}>
                  <SkipForward className="size-5" />
                </Button>
                <span className="w-12 text-xs tabular-nums text-muted-foreground">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact player bar */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <SeekBar
          value={time}
          max={duration}
          onChange={player.seek}
          className="absolute -top-0.5 left-0 h-1 rounded-none"
        />

        <div className="container mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2.5 md:gap-4">
          {/* Cover & info */}
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            onClick={player.toggleLyrics}
          >
            <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
              {currentTrack.pic ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={currentTrack.pic} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Music className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentTrack.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentTrack.artist}</p>
            </div>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-8" onClick={player.prevTrack} title={dict.music.prevTrack}>
              <SkipBack className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9" onClick={player.togglePlay} title={playing ? dict.music.pause : dict.music.play}>
              {buffering
                ? <Loader2 className="size-5 animate-spin" />
                : playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={player.nextTrack} title={dict.music.nextTrack}>
              <SkipForward className="size-4" />
            </Button>
          </div>

          {/* Time */}
          <span className="hidden text-xs tabular-nums text-muted-foreground md:block">
            {formatTime(time)} / {formatTime(duration)}
          </span>

          {/* Lyrics toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn('hidden size-8 md:inline-flex', showLyrics && 'text-primary')}
            onClick={player.toggleLyrics}
            title={dict.music.lyrics}
          >
            <Mic2 className="size-4" />
          </Button>

          {/* Mode */}
          <Button
            variant="ghost"
            size="icon"
            className={cn('hidden size-8 md:inline-flex', mode !== 'sequential' && 'text-primary')}
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
            <SeekBar value={volume} max={1} onChange={player.setVolume} className="w-20" />
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function PlayerSpacer() {
  const { currentTrack } = useMusicPlayer()
  return currentTrack ? <div className="h-[72px]" /> : null
}
