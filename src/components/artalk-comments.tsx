'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import 'artalk/Artalk.css'
import Artalk from 'artalk'

interface ArtalkCommentsProps {
  pageKey: string
  pageTitle: string
}

export function ArtalkComments({ pageKey, pageTitle }: ArtalkCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const artalkRef = useRef<ReturnType<typeof Artalk.init> | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const instance = Artalk.init({
      el: containerRef.current,
      server: 'https://artalk.saop.cc',
      site: '蚕豆私服',
      pageKey,
      pageTitle,
      darkMode: resolvedTheme === 'dark',
    })

    artalkRef.current = instance

    return () => {
      artalkRef.current?.destroy()
      artalkRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, pageTitle])

  useEffect(() => {
    if (artalkRef.current) {
      artalkRef.current.update({ darkMode: resolvedTheme === 'dark' })
    }
  }, [resolvedTheme])

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="mb-6 text-xl font-semibold">评论</h2>
      <div ref={containerRef} />
    </div>
  )
}
