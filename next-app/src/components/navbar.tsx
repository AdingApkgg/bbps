"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale } from "@/contexts/locale-context"
import { getDictionary } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Navbar() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <nav className="fixed left-0 right-0 top-0 z-[1000] border-b border-white/10 bg-[rgba(26,35,42,0.95)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4">
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="flex items-center gap-3 text-inherit no-underline transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/images/logo/logo.avif"
            alt="海岛奇兵私服"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-[#FFD60A] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
            {dict.site.name}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            href={locale === "en" ? "/en/commands" : "/commands"}
            className="text-[0.95rem] font-medium text-white/90 no-underline transition-colors hover:text-[#FFD60A]"
          >
            {dict.nav.commands}
          </Link>
          <a
            href="https://drive.30hb.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.95rem] font-medium text-white/90 no-underline transition-colors hover:text-[#FFD60A]"
          >
            {dict.nav.drive}
          </a>
          <a
            href="https://blog.30hb.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.95rem] font-medium text-white/90 no-underline transition-colors hover:text-[#FFD60A]"
          >
            {dict.nav.blog}
          </a>
          <a
            href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.95rem] font-medium text-white/90 no-underline transition-colors hover:text-[#FFD60A]"
          >
            {dict.nav.editor}
          </a>
        </div>

        <div className="flex gap-2">
          <Link
            href="/en"
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              locale === "en"
                ? "border-white/30 bg-white/20 text-white"
                : "border-white/20 bg-white/10 text-white/70 hover:border-white/30 hover:bg-white/20 hover:text-white"
            )}
          >
            EN
          </Link>
          <Link
            href="/"
            className={cn(
              "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
              locale === "zh"
                ? "border-white/30 bg-white/20 text-white"
                : "border-white/20 bg-white/10 text-white/70 hover:border-white/30 hover:bg-white/20 hover:text-white"
            )}
          >
            中文
          </Link>
        </div>
      </div>

    </nav>
  )
}
