'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'

const ASSETS = 'http://154.21.200.80:8889/png'

export function CtaSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const commandsHref = locale === 'en' ? '/en/commands' : '/commands'

  return (
    <section className="bg-gradient-to-b from-black/5 to-black/10 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid max-w-[1200px] grid-cols-1 items-center gap-12 rounded-[20px] bg-white/95 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] md:mx-auto md:grid-cols-[300px_1fr]">
          <img
            src={`${ASSETS}/%E8%88%B9%E9%95%BF.png`}
            alt="船长"
            className="w-full max-w-[250px] animate-[float_3s_ease-in-out_infinite] md:mx-0 md:max-w-none"
          />
          <div className="flex flex-col gap-6">
            <h2 className="m-0 text-2xl font-black leading-tight text-[#2C2416] md:text-4xl">
              {dict.cta.title}
            </h2>
            <p className="m-0 text-lg leading-relaxed text-[#5C5446]">
              {dict.cta.description}
            </p>
            <Link
              href={commandsHref}
              className="relative flex max-w-[300px] min-h-[60px] cursor-pointer items-center justify-center no-underline transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98]"
            >
              <img
                src={`${ASSETS}/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png`}
                alt=""
                className="absolute inset-0 h-full w-full object-fill"
                aria-hidden
              />
              <span className="relative z-10 px-8 text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                {dict.cta.viewCommands}
              </span>
            </Link>
          </div>
        </div>

        <div className="grid max-w-[1200px] grid-cols-1 items-center gap-12 rounded-[20px] bg-white/95 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] md:mx-auto md:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-6">
            <h2 className="m-0 text-2xl font-black leading-tight text-[#2C2416] md:text-4xl">
              {dict.cta.editorTitle}
            </h2>
            <p className="m-0 text-lg leading-relaxed text-[#5C5446]">
              {dict.cta.editorDescription}
            </p>
            <p className="-mt-2 m-0 text-base italic text-[#8B7355]">
              {dict.cta.signature}
            </p>
            <a
              href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex max-w-[300px] min-h-[60px] cursor-pointer items-center justify-center no-underline transition-[transform,filter] hover:scale-105 hover:brightness-110 active:scale-[0.98]"
            >
              <img
                src={`${ASSETS}/%E7%BA%A2%E8%89%B2%E6%8C%89%E9%92%AE.png`}
                alt=""
                className="absolute inset-0 h-full w-full object-fill"
                aria-hidden
              />
              <span className="relative z-10 px-8 text-xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                {dict.cta.startBuilding}
              </span>
            </a>
          </div>
          <img
            src={`${ASSETS}/%E5%93%88%E8%8E%AB%E6%9B%BC.png`}
            alt="Hammerman"
            className="w-full max-w-[250px] animate-[float_3s_ease-in-out_infinite] md:mx-0 md:max-w-none"
          />
        </div>
      </div>
    </section>
  )
}
