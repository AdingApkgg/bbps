'use client'

import { Users, Trophy, Video } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { useServerStats } from '@/hooks/use-server-stats'
import { cn } from '@/lib/utils'

export function ServerStats() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const {
    onlinePlayers,
    totalPlayers,
    totalReplays,
    players,
    loading,
    error
  } = useServerStats()

  return (
    <section className="bg-white/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center justify-center gap-4 md:flex-row">
          <h2 className="m-0 text-center text-2xl font-black text-[#2C2416] md:text-4xl">
            {dict.stats.onlinePlayers}
          </h2>
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border-2 border-bb-green px-4 py-2 text-sm font-bold text-bb-green',
              (onlinePlayers ?? 0) > 0 && 'animate-pulse'
            )}
          >
            <span className="h-2 w-2 rounded-full bg-bb-green" />
            <span>LIVE</span>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bb-blue to-bb-blue-light text-2xl text-white">
              <Users className="h-8 w-8" />
            </div>
            <div
              className={cn(
                'mb-2 text-3xl font-black text-bb-blue md:text-4xl',
                loading && 'animate-pulse'
              )}
            >
              {loading ? '...' : onlinePlayers}
            </div>
            <div className="text-sm font-semibold uppercase text-[#5C5446]">
              {dict.stats.onlinePlayers}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bb-green to-bb-green-light text-2xl text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <div
              className={cn(
                'mb-2 text-3xl font-black text-bb-green md:text-4xl',
                loading && 'animate-pulse'
              )}
            >
              {loading ? '...' : totalPlayers}
            </div>
            <div className="text-sm font-semibold uppercase text-[#5C5446]">
              {dict.stats.totalPlayers}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bb-orange to-bb-orange-light text-2xl text-white">
              <Video className="h-8 w-8" />
            </div>
            <div
              className={cn(
                'mb-2 text-3xl font-black text-bb-orange md:text-4xl',
                loading && 'animate-pulse'
              )}
            >
              {loading ? '...' : totalReplays}
            </div>
            <div className="text-sm font-semibold uppercase text-[#5C5446]">
              {dict.stats.totalReplays}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[800px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4 bg-gradient-to-br from-bb-green to-bb-green-light px-6 py-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
              <Users className="h-5 w-5" />
            </div>
            <span className="flex-1 text-xl font-bold">{dict.stats.onlinePlayers}</span>
            <span className="rounded-xl bg-white/30 px-3 py-1 text-sm font-bold">
              {players.length}
            </span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-3 py-8 text-[#5C5446]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-bb-bg border-t-bb-green" />
                <span>{dict.stats.loading}</span>
              </div>
            )}
            {!loading && error && (
              <div className="py-8 text-center text-bb-red">{dict.stats.error}</div>
            )}
            {!loading && !error && players.length === 0 && (
              <div className="py-8 text-center text-[#5C5446]">
                {dict.stats.noPlayers}
              </div>
            )}
            {!loading && players.length > 0 &&
              players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 border-b border-bb-bg px-6 py-4 transition-colors hover:bg-bb-bg-light"
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-bb-border text-sm font-bold text-bb-text bg-bb-bg',
                      index === 0 &&
                        'border-bb-yellow-dark bg-gradient-to-br from-bb-yellow to-bb-yellow-light',
                      index === 1 &&
                        'border-gray-400 bg-gradient-to-br from-gray-300 to-gray-200',
                      index === 2 &&
                        'border-amber-700 bg-gradient-to-br from-amber-600 to-amber-400 text-white'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-bb-text">{player.name}</div>
                    <div className="text-xs text-[#5C5446]">ID: {player.id}</div>
                  </div>
                  <div className="h-2 w-2 shrink-0 rounded-full bg-bb-green animate-pulse" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
