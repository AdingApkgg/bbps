"use client"

import { createContext, useContext, useMemo } from "react"
import { usePathname } from "next/navigation"
import type { Locale } from "@/lib/i18n"

const LocaleContext = createContext<Locale>("zh")

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const locale: Locale = useMemo(
    () => (pathname?.startsWith("/en") ? "en" : "zh"),
    [pathname]
  )
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  return ctx ?? "zh"
}
