const STORAGE_API_KEY = 'music-api-endpoint'
const STORAGE_PLAYLISTS_KEY = 'music-playlists'
const STORAGE_VOLUME_KEY = 'music-volume'
const STORAGE_MODE_KEY = 'music-play-mode'

export const DEFAULT_API = 'https://api.i-meto.com/meting/api'

export const DEFAULT_PLAYLISTS: PlaylistConfig[] = [
  { label: 'Asuna', server: 'netease', type: 'playlist', id: '8464409595' },
  { label: 'Baie', server: 'netease', type: 'playlist', id: '2185664294' }
]

export interface PlaylistConfig {
  label: string
  server: string
  type: string
  id: string
}

export interface MetingTrack {
  name: string
  artist: string
  url: string
  pic: string
  lrc: string
}

export type PlayMode = 'sequential' | 'repeat-all' | 'repeat-one' | 'shuffle'

/* ── localStorage helpers ── */

export function loadApiEndpoint(): string {
  if (typeof window === 'undefined') return DEFAULT_API
  return localStorage.getItem(STORAGE_API_KEY) || DEFAULT_API
}

export function saveApiEndpoint(url: string) {
  localStorage.setItem(STORAGE_API_KEY, url)
}

export function loadPlaylists(): PlaylistConfig[] {
  if (typeof window === 'undefined') return DEFAULT_PLAYLISTS
  const raw = localStorage.getItem(STORAGE_PLAYLISTS_KEY)
  if (!raw) return DEFAULT_PLAYLISTS
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PLAYLISTS
    if (parsed.every((p: Record<string, string>) => !p.label)) {
      localStorage.removeItem(STORAGE_PLAYLISTS_KEY)
      return DEFAULT_PLAYLISTS
    }
    return parsed as PlaylistConfig[]
  } catch {
    return DEFAULT_PLAYLISTS
  }
}

export function savePlaylists(list: PlaylistConfig[]) {
  localStorage.setItem(STORAGE_PLAYLISTS_KEY, JSON.stringify(list))
}

export function loadVolume(): number {
  if (typeof window === 'undefined') return 0.8
  const v = localStorage.getItem(STORAGE_VOLUME_KEY)
  return v ? parseFloat(v) : 0.8
}

export function saveVolume(v: number) {
  localStorage.setItem(STORAGE_VOLUME_KEY, String(v))
}

export function loadPlayMode(): PlayMode {
  if (typeof window === 'undefined') return 'sequential'
  return (localStorage.getItem(STORAGE_MODE_KEY) as PlayMode) || 'sequential'
}

export function savePlayMode(m: PlayMode) {
  localStorage.setItem(STORAGE_MODE_KEY, m)
}

/* ── LRC lyrics ── */

export interface LrcLine {
  time: number
  text: string
}

export function parseLrc(raw: string): LrcLine[] {
  const lines: LrcLine[] = []
  for (const line of raw.split('\n')) {
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/)
    if (!match) continue
    const min = parseInt(match[1])
    const sec = parseInt(match[2])
    const ms = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0
    const text = match[4].trim()
    if (text) lines.push({ time: min * 60 + sec + ms / 1000, text })
  }
  return lines.sort((a, b) => a.time - b.time)
}

export async function fetchLrc(lrcField: string): Promise<LrcLine[]> {
  if (!lrcField) return []
  let text = lrcField
  if (lrcField.startsWith('http://') || lrcField.startsWith('https://')) {
    const res = await fetch(lrcField)
    if (!res.ok) return []
    text = await res.text()
  }
  return parseLrc(text)
}

/* ── Meting API ── */

export async function fetchMetingPlaylist(
  apiEndpoint: string,
  config: PlaylistConfig
): Promise<MetingTrack[]> {
  const params = new URLSearchParams({
    server: config.server,
    type: config.type,
    id: config.id
  })
  const res = await fetch(`${apiEndpoint}?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('Invalid response')
  return data.map((item: Record<string, string>) => ({
    name: item.name || item.title || 'Unknown',
    artist: item.artist || item.author || 'Unknown',
    url: item.url || '',
    pic: item.pic || item.cover || '',
    lrc: item.lrc || item.lyric || ''
  }))
}
