'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Plus,
  Trash2,
  Music,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useMusicPlayer } from '@/contexts/music-player-context'
import {
  FadeIn,
  DURATION_REVEAL,
  EASE_ENTRANCE,
  EASE_EXIT,
  useMotionDuration
} from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { loadApiEndpoint, DEFAULT_API } from '@/lib/music'

export function MusicPage() {
  const settingsMs = useMotionDuration(DURATION_REVEAL)
  const locale = useLocale()
  const dict = getDictionary(locale)
  const player = useMusicPlayer()
  const { playlistTracks, loading, error, playingPlaylist, currentTrackIdx, playing, playlists } =
    player

  const [activeTab, setActiveTab] = useState('0')
  const [showSettings, setShowSettings] = useState(false)
  const [apiUrl, setApiUrl] = useState(() =>
    typeof window !== 'undefined' ? loadApiEndpoint() : DEFAULT_API
  )
  const [newLabel, setNewLabel] = useState('')
  const [newServer, setNewServer] = useState('netease')
  const [newType, setNewType] = useState('playlist')
  const [newId, setNewId] = useState('')

  function handleSaveApi() {
    player.saveApiAndRefetch(apiUrl)
  }

  function handleAddPlaylist() {
    if (!newId.trim()) return
    player.addPlaylist({
      label: newLabel.trim() || `List ${playlists.length + 1}`,
      server: newServer,
      type: newType,
      id: newId.trim()
    })
    setNewLabel('')
    setNewId('')
  }

  function handleRemovePlaylist(i: number) {
    player.removePlaylist(i)
    if (Number(activeTab) >= playlists.length - 1 && playlists.length > 1) {
      setActiveTab(String(Math.max(0, playlists.length - 2)))
    }
  }

  const totalTracks = playlistTracks.reduce((s, t) => s + t.length, 0)

  return (
    <div className="container-page pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Header */}
      <FadeIn eager>
        <h1 className="text-display-lg">{dict.music.title}</h1>
        <p className="mt-1 text-headline-sm text-on-surface-medium">{dict.music.description}</p>
      </FadeIn>

      {/* Settings toggle */}
      <FadeIn delay={0.1} className="mt-6">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="flex w-full items-center gap-2 px-3 py-2 text-body-02 font-medium text-on-surface-medium transition-colors duration-fast-01 hover:bg-surface-hover-01 hover:text-on-surface"
        >
          <Settings className="size-4" />
          {dict.music.settings}
          {showSettings ? (
            <ChevronUp className="ml-auto size-4" />
          ) : (
            <ChevronDown className="ml-auto size-4" />
          )}
        </button>

        <AnimatePresence>
          {showSettings && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: { duration: settingsMs, ease: EASE_ENTRANCE }
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: { duration: settingsMs, ease: EASE_EXIT }
              }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-4 rounded-sm bg-surface-02 p-4">
                {/* API endpoint */}
                <div className="space-y-2">
                  <label htmlFor="music-api-endpoint" className="text-body-02 font-medium">
                    {dict.music.apiEndpoint}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="music-api-endpoint"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder={DEFAULT_API}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSaveApi}>
                      {dict.music.save}
                    </Button>
                  </div>
                </div>

                {/* Playlists */}
                <div className="space-y-2">
                  <p className="text-body-02 font-medium">{dict.music.playlists}</p>
                  <div className="space-y-2">
                    {playlists.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-surface-01 px-3 py-2 text-body-02"
                      >
                        <span className="font-medium">{p.label}</span>
                        <span className="text-on-surface-medium">—</span>
                        <span className="truncate font-mono text-label text-on-surface-medium">
                          {p.server}/{p.type}/{p.id}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-7"
                          onClick={() => handleRemovePlaylist(i)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    ))}

                    {/* Add new playlist */}
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="min-w-(--md-sys-size-chip-min) flex-1">
                        <label
                          htmlFor="music-new-label"
                          className="mb-1 block text-label text-on-surface-medium"
                        >
                          {dict.music.tabName}
                        </label>
                        <Input
                          id="music-new-label"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder={dict.music.tabName}
                          className="h-8 text-label"
                        />
                      </div>
                      <div className="w-28">
                        <p className="mb-1 block text-label text-on-surface-medium">
                          {dict.music.server}
                        </p>
                        <Select value={newServer} onValueChange={setNewServer}>
                          <SelectTrigger aria-label={dict.music.server} className="h-8 text-label">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="netease">Netease</SelectItem>
                            <SelectItem value="tencent">Tencent</SelectItem>
                            <SelectItem value="kugou">Kugou</SelectItem>
                            <SelectItem value="xiami">Xiami</SelectItem>
                            <SelectItem value="baidu">Baidu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-28">
                        <p className="mb-1 block text-label text-on-surface-medium">
                          {dict.music.type}
                        </p>
                        <Select value={newType} onValueChange={setNewType}>
                          <SelectTrigger aria-label={dict.music.type} className="h-8 text-label">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="playlist">Playlist</SelectItem>
                            <SelectItem value="song">Song</SelectItem>
                            <SelectItem value="album">Album</SelectItem>
                            <SelectItem value="artist">Artist</SelectItem>
                            <SelectItem value="search">Search</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-(--md-sys-size-control-min) flex-1">
                        <label
                          htmlFor="music-new-id"
                          className="mb-1 block text-label text-on-surface-medium"
                        >
                          ID
                        </label>
                        <Input
                          id="music-new-id"
                          value={newId}
                          onChange={(e) => setNewId(e.target.value)}
                          placeholder="ID"
                          className="h-8 text-label"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddPlaylist()}
                        />
                      </div>
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={handleAddPlaylist}
                        disabled={!newId.trim()}
                      >
                        <Plus className="size-3.5" />
                        {dict.music.add}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Tabbed track list */}
      <FadeIn delay={0.2} className="mt-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-on-surface-medium">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-body-02">{dict.music.loading}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-on-surface-medium">
            <AlertCircle className="size-6" />
            <span className="text-body-02">{dict.music.loadError}</span>
            <Button variant="outline" size="sm" onClick={player.retry}>
              <RefreshCw className="mr-1 size-3.5" />
              {dict.music.retry}
            </Button>
          </div>
        ) : totalTracks === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-on-surface-medium">
            <Music className="size-6" />
            <span className="text-body-02">{dict.music.noTracks}</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              {playlists.map((p, i) => (
                <TabsTrigger key={i} value={String(i)} className="gap-2">
                  {p.label}
                  <span className="text-label text-on-surface-medium">
                    {playlistTracks[i]?.length ?? 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {playlists.map((_, pIdx) => {
              const tracks = playlistTracks[pIdx] ?? []
              return (
                <TabsContent key={pIdx} value={String(pIdx)}>
                  {tracks.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-12 text-on-surface-medium">
                      <Music className="size-6" />
                      <span className="text-body-02">{dict.music.noTracks}</span>
                    </div>
                  ) : (
                    <div data-list-group className="overflow-hidden rounded-sm bg-surface-02">
                      {tracks.map((track, tIdx) => {
                        const isActive = playingPlaylist === pIdx && currentTrackIdx === tIdx
                        return (
                          <button
                            key={`${track.name}-${track.artist}-${tIdx}`}
                            type="button"
                            data-list-item
                            onClick={() => player.playTrack(pIdx, tIdx)}
                            className={cn(
                              'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-fast-01 hover:bg-surface-hover-01',
                              isActive && 'bg-surface-hover-01'
                            )}
                          >
                            <div className="relative size-10 flex-shrink-0 overflow-hidden bg-surface-variant-01">
                              {track.pic ? (
                                /* biome-ignore lint/performance/noImgElement: 远程封面来自任意主机，next/image 在静态导出下不适用 */
                                <img
                                  src={track.pic}
                                  alt=""
                                  className="size-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center">
                                  <Music className="size-4 text-on-surface-medium" />
                                </div>
                              )}
                              {isActive && playing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-scrim">
                                  <div className="flex items-end gap-0.5">
                                    {[0, 1, 2].map((j) => (
                                      <span
                                        key={j}
                                        className="inline-block w-0.5 animate-pulse rounded-full bg-on-primary"
                                        style={{
                                          height: `${8 + j * 4}px`,
                                          animationDelay: `${j * 150}ms`
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  'truncate text-body-02 font-medium',
                                  isActive && 'text-on-surface'
                                )}
                              >
                                {track.name}
                              </p>
                              <p className="truncate text-label text-on-surface-medium">
                                {track.artist}
                              </p>
                            </div>

                            <span className="text-label tabular-nums text-on-surface-medium">
                              {tIdx + 1}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </FadeIn>
    </div>
  )
}
