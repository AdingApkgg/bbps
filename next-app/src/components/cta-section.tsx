'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ASSETS } from '@/lib/assets'

export function CtaSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const commandsHref = locale === 'en' ? '/en/commands' : '/commands'

  return (
    <section className="container max-w-7xl space-y-8 px-4 py-12">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-[200px_1fr]">
          <img
            src={ASSETS.commander}
            alt="船长"
            className="w-full max-w-[200px] animate-[float_3s_ease-in-out_infinite] justify-self-center"
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              {dict.cta.title}
            </h2>
            <p className="text-muted-foreground">{dict.cta.description}</p>
            <Button asChild>
              <Link href={commandsHref}>{dict.cta.viewCommands}</Link>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
              {dict.cta.editorTitle}
            </h2>
            <p className="text-muted-foreground">{dict.cta.editorDescription}</p>
            <p className="text-sm italic text-muted-foreground">
              {dict.cta.signature}
            </p>
            <Button variant="destructive" asChild>
              <a
                href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.cta.startBuilding}
              </a>
            </Button>
          </div>
          <img
            src={ASSETS.hammerman}
            alt="Hammerman"
            className="w-full max-w-[200px] animate-[float_3s_ease-in-out_infinite] justify-self-center"
          />
        </div>
      </Card>
    </section>
  )
}
