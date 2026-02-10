'use client'

import Image from 'next/image'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'

export function HeroSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 pt-24">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://r2.30hb.cn/hero.avif)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
      </div>

      <div className="flex max-w-[600px] flex-col items-center gap-8 text-center">
        <p className="m-0 text-2xl font-semibold text-white drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)] md:text-3xl">
          {dict.hero.welcome}
        </p>
        <div className="animate-[float_3s_ease-in-out_infinite]">
          <Image
            src="/assets/images/logo/logo.avif"
            alt="Logo"
            width={120}
            height={120}
            className="rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:h-[120px] md:w-[120px]"
          />
        </div>
        <h1 className="m-0 text-3xl font-black uppercase tracking-wide text-[#FFD60A] [text-shadow:3px_3px_0_rgba(0,0,0,0.8),-1px_-1px_0_rgba(0,0,0,0.5)] md:text-5xl">
          {dict.site.name}
        </h1>

        <div className="flex w-full max-w-[400px] flex-col gap-4">
          <a
            href="https://30hb.cn/latest"
            className="relative flex min-h-[60px] cursor-pointer items-center justify-center no-underline transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98]"
          >
            <img
              src="http://154.21.200.80:8889/png/%E7%BB%BF%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              className="absolute inset-0 h-full w-full object-fill"
              aria-hidden
            />
            <span className="relative z-10 px-8 text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
              {dict.hero.download}
            </span>
          </a>
          <a
            href="https://drive.30hb.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex min-h-[60px] cursor-pointer items-center justify-center no-underline transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98]"
          >
            <img
              src="http://154.21.200.80:8889/png/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              className="absolute inset-0 h-full w-full object-fill"
              aria-hidden
            />
            <span className="relative z-10 px-8 text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
              {dict.hero.moreServers}
            </span>
          </a>
        </div>

        <div className="mt-4 flex gap-6">
          <a
            href="https://qm.qq.com/q/qDf9qDK8g2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
              alt="QQ群"
              className="h-12 w-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
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
              className="h-12 w-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
            />
          </a>
        </div>

        <p className="mt-4 text-sm text-white/80 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
          {dict.site.copyright}
        </p>
      </div>
    </section>
  )
}
