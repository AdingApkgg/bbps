'use client'

import { Download, HardDrive } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion'

const DOWNLOAD_URL = 'https://30hb.cn/latest'
const DRIVE_URL = 'https://drive.30hb.cn/'

export function DownloadsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const d = dict.downloads

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
      <FadeIn className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="mt-2 text-muted-foreground">{d.subtitle}</p>
      </FadeIn>

      <div className="mt-10 grid gap-4">
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{d.primary}</h2>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '蚕豆私服推荐客户端' : 'Recommended client'}
                  </p>
                </div>
              </div>
              <Button size="lg" className="w-full shrink-0 sm:w-auto" asChild>
                <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                  {d.primary}
                </a>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <HardDrive className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-medium">{d.moreServers}</h2>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '网盘与其它服务器' : 'Drive & other servers'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full shrink-0 sm:w-auto"
                asChild
              >
                <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer">
                  {dict.nav.drive}
                </a>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
