'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type WalineInstance = { update: (opts: Record<string, unknown>) => void; destroy: () => void }

export function CommentsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const containerRef = useRef<HTMLDivElement>(null)
  const walineRef = useRef<WalineInstance | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()

  const dark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current) return
    let mounted = true
    ;(async () => {
      const { init } = await import('@waline/client')
      await import('@waline/client/style')
      if (!mounted || !containerRef.current) return
      const instance = init({
        el: containerRef.current,
        serverURL: 'https://waline.saop.cc',
        path: 'disk.saop.cc',
        lang: locale === 'en' ? 'en' : 'zh-CN',
        dark: dark ? 'auto' : false,
        reaction: true
      })
      if (instance) walineRef.current = instance
      setLoaded(true)
    })().catch(console.error)
    return () => {
      mounted = false
      walineRef.current?.destroy()
      walineRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (walineRef.current) {
      walineRef.current.update({
        path: 'disk.saop.cc',
        dark: dark ? 'auto' : false,
        lang: locale === 'en' ? 'en' : 'zh-CN'
      })
    }
  }, [dark, locale])

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        {dict.comments.title}
      </h1>
      <Card className="mt-10">
        <CardContent className="p-6">
          {!loaded && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          )}
          <div ref={containerRef} />
        </CardContent>
      </Card>
    </section>
  )
}
