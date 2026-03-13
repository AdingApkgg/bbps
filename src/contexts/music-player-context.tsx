'use client'

import {
  createContext, useContext, useState, useRef, useEffect,
  useCallback, useMemo, type ReactNode
} from 'react'
import {
  loadApiEndpoint, saveApiEndpoint as persistApi,
  loadPlaylists, savePlaylists as persistPlaylists,
  loadVolume, saveVolume as persistVolume,
  loadPlayMode, savePlayMode as persistPlayMode,
  fetchMetingPlaylist, fetchLrc,
  DEFAULT_API, DEFAULT_PLAYLISTS,
  type MetingTrack, type PlaylistConfig, type PlayMode, type LrcLine
} from '@/lib/music'

interface MusicPlayerContextValue {
  audio: HTMLAudioElement | null
  playlistTracks: MetingTrack[][]
  loading: boolean
  error: boolean
  playingPlaylist: number
  currentTrackIdx: number | null
  currentTrack: MetingTrack | null
  playing: boolean
  volume: number
  mode: PlayMode
  buffering: boolean
  lyrics: LrcLine[]
  lyricsLoading: boolean
  showLyrics: boolean
  playlists: PlaylistConfig[]
  playTrack: (playlistIdx: number, trackIdx: number) => void
  togglePlay: () => void
  prevTrack: () => void
  nextTrack: () => void
  seek: (t: number) => void
  setVolume: (v: number) => void
  cycleMode: () => void
  toggleLyrics: () => void
  addPlaylist: (p: PlaylistConfig) => void
  removePlaylist: (i: number) => void
  saveApiAndRefetch: (url: string) => void
  retry: () => void
}

const Ctx = createContext<MusicPlayerContextValue | null>(null)

export function useMusicPlayer() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMusicPlayer requires MusicPlayerProvider')
  return ctx
}

export function useMusicTime() {
  const { audio } = useMusicPlayer()
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!audio) return
    const onTime = () => setTime(audio.currentTime)
    const onDur = () => { if (isFinite(audio.duration)) setDuration(audio.duration) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('durationchange', onDur)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('durationchange', onDur)
    }
  }, [audio])

  return { time, duration }
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [audio] = useState<HTMLAudioElement | null>(() => {
    if (typeof window === 'undefined') return null
    const a = new Audio()
    a.preload = 'metadata'
    return a
  })

  const [playlists, setPlaylists] = useState<PlaylistConfig[]>(() =>
    typeof window !== 'undefined' ? loadPlaylists() : DEFAULT_PLAYLISTS
  )
  const [configVer, setConfigVer] = useState(0)

  const [playlistTracks, setPlaylistTracks] = useState<MetingTrack[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [playingPlaylist, setPlayingPlaylist] = useState(0)
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(() =>
    typeof window !== 'undefined' ? loadVolume() : 0.8
  )
  const [mode, setModeState] = useState<PlayMode>(() =>
    typeof window !== 'undefined' ? loadPlayMode() : 'sequential'
  )
  const [buffering, setBuffering] = useState(false)

  const [lyrics, setLyrics] = useState<LrcLine[]>([])
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)

  const playlistIdxRef = useRef(0)
  const trackIdxRef = useRef<number | null>(null)
  const modeRef = useRef<PlayMode>('sequential')
  const allTracksRef = useRef<MetingTrack[][]>([])

  useEffect(() => { playlistIdxRef.current = playingPlaylist }, [playingPlaylist])
  useEffect(() => { trackIdxRef.current = currentTrackIdx }, [currentTrackIdx])
  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { allTracksRef.current = playlistTracks }, [playlistTracks])

  const currentTrack = useMemo(() => {
    if (currentTrackIdx === null) return null
    return playlistTracks[playingPlaylist]?.[currentTrackIdx] ?? null
  }, [currentTrackIdx, playingPlaylist, playlistTracks])

  const playTrack = useCallback((pIdx: number, tIdx: number) => {
    if (!audio) return
    const tracks = allTracksRef.current[pIdx]
    if (!tracks || tIdx < 0 || tIdx >= tracks.length) return
    setPlayingPlaylist(pIdx)
    playlistIdxRef.current = pIdx
    setCurrentTrackIdx(tIdx)
    trackIdxRef.current = tIdx
    setPlaying(true)
    audio.src = tracks[tIdx].url
    audio.play().catch(() => setPlaying(false))
  }, [audio])

  /* audio events */
  useEffect(() => {
    if (!audio) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onWaiting = () => setBuffering(true)
    const onCanPlay = () => setBuffering(false)
    const onEnded = () => {
      const pIdx = playlistIdxRef.current
      const tIdx = trackIdxRef.current
      const m = modeRef.current
      const tracks = allTracksRef.current[pIdx]
      if (tIdx === null || !tracks || tracks.length === 0) return

      if (m === 'repeat-one') {
        audio.currentTime = 0
        audio.play().catch(() => {})
        return
      }

      let next: number
      if (m === 'shuffle') {
        next = Math.floor(Math.random() * tracks.length)
      } else {
        next = tIdx + 1
        if (next >= tracks.length) {
          if (m === 'repeat-all') next = 0
          else { setPlaying(false); return }
        }
      }
      setCurrentTrackIdx(next)
      trackIdxRef.current = next
      audio.src = tracks[next].url
      audio.play().catch(() => {})
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audio])

  /* volume */
  useEffect(() => {
    if (audio) audio.volume = volume
    persistVolume(volume)
  }, [audio, volume])

  /* MediaSession */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.name,
      artist: currentTrack.artist,
      artwork: currentTrack.pic ? [{ src: currentTrack.pic }] : []
    })
    navigator.mediaSession.setActionHandler('play', () => audio?.play())
    navigator.mediaSession.setActionHandler('pause', () => audio?.pause())
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      const pIdx = playlistIdxRef.current
      const tIdx = trackIdxRef.current
      if (tIdx !== null && tIdx > 0) playTrack(pIdx, tIdx - 1)
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      const pIdx = playlistIdxRef.current
      const tIdx = trackIdxRef.current
      const tracks = allTracksRef.current[pIdx]
      if (tIdx !== null && tracks && tIdx < tracks.length - 1)
        playTrack(pIdx, tIdx + 1)
    })
  }, [audio, currentTrack, playTrack])

  /* fetch tracks per playlist */
  useEffect(() => {
    if (playlists.length === 0) return
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(false)
      const endpoint = loadApiEndpoint()
      const results = await Promise.allSettled(
        playlists.map(p => fetchMetingPlaylist(endpoint, p))
      )
      if (cancelled) return
      const perPlaylist = results.map(r =>
        r.status === 'fulfilled' ? r.value : []
      )
      if (perPlaylist.every(t => t.length === 0) && results.every(r => r.status === 'rejected'))
        setError(true)
      setPlaylistTracks(perPlaylist)
      setLoading(false)
    }
    run()

    return () => { cancelled = true }
  }, [playlists, configVer])

  /* fetch lyrics on track change */
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const pIdx = playlistIdxRef.current
      const tIdx = trackIdxRef.current
      const track = tIdx !== null ? allTracksRef.current[pIdx]?.[tIdx] : null
      if (!track?.lrc) {
        setLyrics([])
        setLyricsLoading(false)
        return
      }
      setLyricsLoading(true)
      try {
        const lines = await fetchLrc(track.lrc)
        if (!cancelled) setLyrics(lines)
      } catch {
        if (!cancelled) setLyrics([])
      } finally {
        if (!cancelled) setLyricsLoading(false)
      }
    }
    run()

    return () => { cancelled = true }
  }, [currentTrackIdx, playingPlaylist])

  /* controls */
  const togglePlay = useCallback(() => {
    if (!audio) return
    if (currentTrackIdx === null) {
      for (let i = 0; i < allTracksRef.current.length; i++) {
        if (allTracksRef.current[i]?.length > 0) { playTrack(i, 0); return }
      }
      return
    }
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [audio, currentTrackIdx, playTrack])

  const prevTrack = useCallback(() => {
    const pIdx = playlistIdxRef.current
    const tIdx = trackIdxRef.current
    if (tIdx === null) return
    const tracks = allTracksRef.current[pIdx]
    if (!tracks) return
    playTrack(pIdx, tIdx > 0 ? tIdx - 1 : tracks.length - 1)
  }, [playTrack])

  const nextTrack = useCallback(() => {
    const pIdx = playlistIdxRef.current
    const tIdx = trackIdxRef.current
    if (tIdx === null) return
    const tracks = allTracksRef.current[pIdx]
    if (!tracks) return
    if (modeRef.current === 'shuffle') playTrack(pIdx, Math.floor(Math.random() * tracks.length))
    else playTrack(pIdx, tIdx < tracks.length - 1 ? tIdx + 1 : 0)
  }, [playTrack])

  const seek = useCallback((t: number) => {
    if (audio) audio.currentTime = t
  }, [audio])

  const setVolume = useCallback((v: number) => { setVolumeState(v) }, [])

  const cycleMode = useCallback(() => {
    const modes: PlayMode[] = ['sequential', 'repeat-all', 'repeat-one', 'shuffle']
    setModeState(prev => {
      const next = modes[(modes.indexOf(prev) + 1) % modes.length]
      persistPlayMode(next)
      return next
    })
  }, [])

  const addPlaylist = useCallback((p: PlaylistConfig) => {
    setPlaylists(prev => {
      const updated = [...prev, p]
      persistPlaylists(updated)
      return updated
    })
  }, [])

  const removePlaylist = useCallback((i: number) => {
    setPlaylists(prev => {
      const updated = prev.filter((_, idx) => idx !== i)
      const result = updated.length > 0 ? updated : DEFAULT_PLAYLISTS
      persistPlaylists(result)
      return result
    })
  }, [])

  const saveApiAndRefetch = useCallback((url: string) => {
    persistApi(url)
    setConfigVer(v => v + 1)
  }, [])

  const retry = useCallback(() => { setConfigVer(v => v + 1) }, [])

  const toggleLyrics = useCallback(() => { setShowLyrics(prev => !prev) }, [])

  const value = useMemo<MusicPlayerContextValue>(() => ({
    audio,
    playlistTracks, loading, error,
    playingPlaylist, currentTrackIdx, currentTrack,
    playing, volume, mode, buffering,
    lyrics, lyricsLoading, showLyrics,
    playlists,
    playTrack, togglePlay, prevTrack, nextTrack,
    seek, setVolume, cycleMode,
    toggleLyrics,
    addPlaylist, removePlaylist, saveApiAndRefetch, retry
  }), [
    audio,
    playlistTracks, loading, error,
    playingPlaylist, currentTrackIdx, currentTrack,
    playing, volume, mode, buffering,
    lyrics, lyricsLoading, showLyrics,
    playlists,
    playTrack, togglePlay, prevTrack, nextTrack,
    seek, setVolume, cycleMode,
    toggleLyrics,
    addPlaylist, removePlaylist, saveApiAndRefetch, retry
  ])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
