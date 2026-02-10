"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "@/contexts/locale-context"
import { getDictionary } from "@/lib/i18n"

export function CommentsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let mounted = true
    import("@waline/client").then(({ init }) => {
      if (!mounted || !containerRef.current) return
      import("@waline/client/waline.css")
      init({
        el: containerRef.current,
        serverURL: "https://waline.saop.cc",
        path: "disk.saop.cc",
      })
    }).catch(console.error)
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="bg-white/30 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-black text-[#2C2416] md:text-4xl">
          {dict.comments.title}
        </h2>
        <div className="mx-auto max-w-[900px] rounded-2xl bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
          <div ref={containerRef} />
        </div>
      </div>
    </section>
  )
}
