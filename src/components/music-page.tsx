'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Plus, Trash2,
  Music, Loader2, ChevronDown, ChevronUp,
  AlertCircle, RefreshCw
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useMusicPlayer } from '@/contexts/music-player-context'
import { FadeIn } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { loadApiEndpoint, DEFAULT_API } from '@/lib/music'

export function MusicPage() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const player = useMusicPlayer()
  const {
    playlistTracks, loading, error,
    playingPlaylist, currentTrackIdx, playing,
    playlists
  } = player

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
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
      {/* Header */}
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">{dict.music.title}</h1>
        <p className="mt-4 text-muted-foreground">{dict.music.description}</p>
      </FadeIn>

      {/* Settings toggle */}
      <FadeIn delay={0.1} className="mx-auto mt-8 max-w-3xl">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="size-4" />
          {dict.music.settings}
          {showSettings
            ? <ChevronUp className="ml-auto size-4" />
            : <ChevronDown className="ml-auto size-4" />}
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="mt-2">
                <CardContent className="space-y-4 p-4">
                  {/* API endpoint */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{dict.music.apiEndpoint}</label>
                    <div className="flex gap-2">
                      <Input
                        value={apiUrl}
                        onChange={e => setApiUrl(e.target.value)}
                        placeholder={DEFAULT_API}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSaveApi}>
                        {dict.music.save}
                      </Button>
                    </div>
                  </div>

                  {/* Playlists */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{dict.music.playlists}</label>
                    <div className="space-y-2">
                      {playlists.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5 text-sm">
                          <span className="font-medium">{p.label}</span>
                          <span className="text-muted-foreground">—</span>
                          <span className="truncate font-mono text-xs text-muted-foreground">
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
                        <div className="min-w-[80px] flex-1">
                          <label className="mb-1 block text-xs text-muted-foreground">
                            {dict.music.tabName}
                          </label>
                          <Input
                            value={newLabel}
                            onChange={e => setNewLabel(e.target.value)}
                            placeholder={dict.music.tabName}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="w-28">
                          <label className="mb-1 block text-xs text-muted-foreground">
                            {dict.music.server}
                          </label>
                          <Select value={newServer} onValueChange={setNewServer}>
                            <SelectTrigger className="h-8 text-xs">
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
                          <label className="mb-1 block text-xs text-muted-foreground">
                            {dict.music.type}
                          </label>
                          <Select value={newType} onValueChange={setNewType}>
                            <SelectTrigger className="h-8 text-xs">
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
                        <div className="min-w-[100px] flex-1">
                          <label className="mb-1 block text-xs text-muted-foreground">ID</label>
                          <Input
                            value={newId}
                            onChange={e => setNewId(e.target.value)}
                            placeholder="ID"
                            className="h-8 text-xs"
                            onKeyDown={e => e.key === 'Enter' && handleAddPlaylist()}
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeIn>

      {/* Tabbed track list */}
      <FadeIn delay={0.2} className="mx-auto mt-8 max-w-3xl">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-sm">{dict.music.loading}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <AlertCircle className="size-6" />
            <span className="text-sm">{dict.music.loadError}</span>
            <Button variant="outline" size="sm" onClick={player.retry}>
              <RefreshCw className="mr-1 size-3.5" />
              {dict.music.retry}
            </Button>
          </div>
        ) : totalTracks === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Music className="size-6" />
            <span className="text-sm">{dict.music.noTracks}</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              {playlists.map((p, i) => (
                <TabsTrigger key={i} value={String(i)} className="gap-1.5">
                  {p.label}
                  <span className="text-xs text-muted-foreground">
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
                    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                      <Music className="size-6" />
                      <span className="text-sm">{dict.music.noTracks}</span>
                    </div>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {tracks.map((track, tIdx) => {
                        const isActive = playingPlaylist === pIdx && currentTrackIdx === tIdx
                        return (
                          <button
                            key={`${track.name}-${track.artist}-${tIdx}`}
                            type="button"
                            onClick={() => player.playTrack(pIdx, tIdx)}
                            className={cn(
                              'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent/50',
                              isActive && 'bg-accent'
                            )}
                          >
                            <div className="relative size-10 flex-shrink-0 overflow-hidden rounded bg-muted">
                              {track.pic ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={track.pic} alt="" className="size-full object-cover" loading="lazy" />
                              ) : (
                                <div className="flex size-full items-center justify-center">
                                  <Music className="size-4 text-muted-foreground" />
                                </div>
                              )}
                              {isActive && playing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <div className="flex items-end gap-0.5">
                                    {[0, 1, 2].map(j => (
                                      <span
                                        key={j}
                                        className="inline-block w-0.5 animate-pulse rounded-full bg-white"
                                        style={{ height: `${8 + j * 4}px`, animationDelay: `${j * 150}ms` }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={cn('truncate text-sm font-medium', isActive && 'text-primary')}>
                                {track.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                            </div>

                            <span className="text-xs tabular-nums text-muted-foreground">{tIdx + 1}</span>
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
