'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function HeroSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const downloadsHref = locale === 'en' ? '/en/downloads' : '/downloads'

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-20">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://r2.30hb.cn/hero.avif)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/65" />
      </div>

      <Card className="w-full max-w-md border-0 bg-background/95 shadow-2xl backdrop-blur-md">
        <CardContent className="flex flex-col items-center gap-8 px-8 pt-10 pb-8 text-center">
          <p className="text-base font-medium text-muted-foreground">
            {dict.hero.welcome}
          </p>
          <div className="animate-[float_3s_ease-in-out_infinite]">
            <Image
              src="/assets/images/logo/logo.avif"
              alt=""
              width={88}
              height={88}
              className="rounded-xl shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {dict.site.name}
          </h1>
          <p className="text-sm text-muted-foreground">{dict.hero.subtitle}</p>

          <Button size="lg" className="w-full text-base" asChild>
            <Link href={downloadsHref}>{dict.hero.download}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
