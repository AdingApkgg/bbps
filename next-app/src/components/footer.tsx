"use client"

import Image from "next/image"
import { useLocale } from "@/contexts/locale-context"
import { getDictionary } from "@/lib/i18n"

export function Footer() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <footer className="border-t border-white/10 bg-[rgba(26,35,42,0.95)] px-4 pb-6 pt-12 text-white/80">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/images/logo/logo.avif"
                alt="海岛奇兵私服"
                width={48}
                height={48}
                className="rounded-[10px]"
              />
              <span className="text-2xl font-bold text-[#FFD60A] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] md:text-3xl">
                {dict.site.name}
              </span>
            </div>
            <p className="m-0 text-sm leading-relaxed text-white/60">
              {dict.footer.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="m-0 mb-2 text-base font-bold text-white">
              {dict.footer.quickLinks}
            </h3>
            <a
              href="https://30hb.cn/news/"
              className="text-sm text-white/70 no-underline transition-colors hover:text-[#FFD60A]"
            >
              {dict.nav.commands}
            </a>
            <a
              href="https://drive.30hb.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 no-underline transition-colors hover:text-[#FFD60A]"
            >
              {dict.nav.drive}
            </a>
            <a
              href="https://blog.30hb.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 no-underline transition-colors hover:text-[#FFD60A]"
            >
              {dict.nav.blog}
            </a>
            <a
              href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 no-underline transition-colors hover:text-[#FFD60A]"
            >
              {dict.nav.editor}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="m-0 text-base font-bold text-white">
              {dict.footer.community}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://qm.qq.com/q/qDf9qDK8g2"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <img
                  src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
                  alt="QQ群"
                  className="h-10 w-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </a>
              <a
                href="https://discord.gg/rGAGWDerzB"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3670/3670157.png"
                  alt="Discord"
                  className="h-10 w-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="m-0 mb-2 text-sm text-white/60">{dict.site.copyright}</p>
          <p className="m-0 text-xs text-white/40">{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
