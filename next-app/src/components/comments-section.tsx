'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CommentsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    let mounted = true
    import('@waline/client')
      .then(({ init }) => {
        if (!mounted || !containerRef.current) return
        import('@waline/client/style')
        init({
          el: containerRef.current,
          serverURL: 'https://waline.saop.cc',
          path: 'disk.saop.cc'
        })
        setLoaded(true)
      })
      .catch(console.error)
    return () => {
      mounted = false
    }
  }, [])

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
