'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type WalineInstance = { update: (opts: Record<string, unknown>) => void; destroy: () => void }

function WalinePanel() {
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const walineRef = useRef<WalineInstance | null>(null)
  const readyRef = useRef(false)
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let cancelled = false
    ;(async () => {
      const { init } = await import('@waline/client')
      await import('@waline/client/style')
      if (cancelled || !el.isConnected) return
      const instance = init({
        el,
        serverURL: 'https://waline.saop.cc',
        path: 'disk.saop.cc',
        lang: locale === 'en' ? 'en' : 'zh-CN',
        dark: dark ? 'auto' : false,
        reaction: true
      })
      if (instance) {
        walineRef.current = instance
        readyRef.current = true
      }
      setLoaded(true)
    })().catch(() => { /* dynamic import aborted on unmount */ })
    return () => {
      cancelled = true
      walineRef.current = null
      readyRef.current = false
      el.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    walineRef.current?.update({
      path: 'disk.saop.cc',
      dark: dark ? 'auto' : false,
      lang: locale === 'en' ? 'en' : 'zh-CN'
    })
  }, [dark, locale])

  return (
    <>
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
    </>
  )
}

function ArtalkPanel({ lang }: { lang: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const artalkRef = useRef<ReturnType<typeof import('artalk').default.init> | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  const artalkLocale = lang === 'en' ? 'en' : 'zh-CN'

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let cancelled = false
    ;(async () => {
      const { default: Artalk } = await import('artalk')
      // @ts-expect-error artalk/Artalk.css has no type declarations
      await import('artalk/Artalk.css')
      if (cancelled || !el.isConnected) return
      const instance = Artalk.init({
        el,
        server: 'https://artalk.saop.cc',
        site: '蚕豆私服',
        pageKey: '/comments/',
        pageTitle: '评论',
        locale: artalkLocale,
        darkMode: resolvedTheme === 'dark'
      })
      artalkRef.current = instance
      setLoaded(true)
    })().catch(() => { /* dynamic import aborted on unmount */ })
    return () => {
      cancelled = true
      artalkRef.current = null
      el.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    artalkRef.current?.update({ darkMode: resolvedTheme === 'dark' })
  }, [resolvedTheme])

  return (
    <>
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
    </>
  )
}

export function CommentsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const [activeTab, setActiveTab] = useState('waline')

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        {dict.comments.title}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
        <TabsList className="mx-auto grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="waline">Waline</TabsTrigger>
          <TabsTrigger value="artalk">Artalk</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardContent className="p-6">
            <TabsContent value="waline" className="mt-0">
              <WalinePanel />
            </TabsContent>
            <TabsContent value="artalk" className="mt-0">
              <ArtalkPanel key={locale} lang={locale} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  )
}
