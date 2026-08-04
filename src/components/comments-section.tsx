'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
      await import('artalk/Artalk.css')
      if (cancelled || !el.isConnected) return
      const instance = Artalk.init({
        el,
        server: 'https://artalk.saop.cc',
        site: '蚕豆私服',
        pageKey: '/comments/',
        pageTitle: '评论',
        locale: artalkLocale,
        darkMode: resolvedTheme === 'dark',
        // 服务端配置里带着 locale: 'zh-CN'，会盖掉英文站的 locale。
        // 该项默认就是 false（本地配置优先），这里显式写死，避免后端改动或默认值变化导致英文站变中文。
        preferRemoteConf: false
      })
      artalkRef.current = instance
      setLoaded(true)
    })().catch(() => { /* dynamic import aborted on unmount */ })
    return () => {
      cancelled = true
      // 必须 destroy：Artalk 会把弹层挂到 document.body 上，只清空 el 会让旧实例
      // （连同它的旧语言和事件监听）残留，每切换一次语言就多泄漏一个
      artalkRef.current?.destroy()
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

  return (
    <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        {dict.comments.title}
      </h1>

      <Card className="mt-10">
        <CardContent className="p-6">
          <ArtalkPanel key={locale} lang={locale} />
        </CardContent>
      </Card>
    </section>
  )
}
