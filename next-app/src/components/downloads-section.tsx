'use client'

import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const DOWNLOAD_URL = 'https://30hb.cn/latest'
const DRIVE_URL = 'https://drive.30hb.cn/'

export function DownloadsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const d = dict.downloads

  return (
    <div className="container max-w-2xl space-y-8 px-4 py-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{d.title}</h1>
        <p className="text-muted-foreground">{d.subtitle}</p>
      </div>

      <div className="grid gap-4">
        <Card className="overflow-hidden border-2 border-primary/20 transition-colors hover:border-primary/40">
          <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <svg
                  className="h-7 w-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
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

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <svg
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-medium">{d.moreServers}</h2>
                <p className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '网盘与其它服务器' : 'Drive & other servers'}
                </p>
              </div>
            </div>
            <Button variant="secondary" className="w-full shrink-0 sm:w-auto" asChild>
              <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer">
                {dict.nav.drive}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
