'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'

export function CommentsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const containerRef = useRef<HTMLDivElement>(null)

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
      })
      .catch(console.error)
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="container max-w-4xl space-y-6 px-4 py-12">
      <h2 className="text-center text-2xl font-semibold">
        {dict.comments.title}
      </h2>
      <Card>
        <CardContent className="pt-6">
          <div ref={containerRef} />
        </CardContent>
      </Card>
    </section>
  )
}
