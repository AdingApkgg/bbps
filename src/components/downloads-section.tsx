'use client'

import type { LucideIcon } from 'lucide-react'
import { Download, HardDrive, Sparkles, Cat, Flower2, CloudFog, Monitor, Apple, Smartphone } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FadeIn } from '@/components/motion'
import privateServers from '@/data/private-servers.json'

const DOWNLOAD_URL = 'https://30hb.cn/latest'
const DRIVE_URL = 'https://drive.30hb.cn/'

const ICON_MAP: Record<string, LucideIcon> = {
  'sparkles': Sparkles,
  'cat': Cat,
  'flower-2': Flower2,
  'cloud-fog': CloudFog,
}

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

      {/* 安装教程 */}
      <FadeIn delay={0.1} className="mt-10">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold tracking-tight">{d.guideTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{d.guideSubtitle}</p>
        </div>

        <Tabs defaultValue="android" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="android" className="gap-1.5">
              <Smartphone className="h-4 w-4" />
              {d.guide.android.label}
            </TabsTrigger>
            <TabsTrigger value="apple" className="gap-1.5">
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">{d.guide.apple.label}</span>
              <span className="sm:hidden">iOS</span>
            </TabsTrigger>
            <TabsTrigger value="windows" className="gap-1.5">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">{d.guide.windows.label}</span>
              <span className="sm:hidden">Win</span>
            </TabsTrigger>
          </TabsList>

          {(['android', 'apple', 'windows'] as const).map((platform) => (
            <TabsContent key={platform} value={platform}>
              <Card>
                <CardContent className="p-6">
                  <ol className="space-y-3">
                    {d.guide[platform].steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </FadeIn>

      <div className="mt-10 grid gap-4">
        <FadeIn delay={0.25}>
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

        {privateServers.length > 0 && (
          <FadeIn delay={0.15}>
            <div className="mt-6 mb-2">
              <h2 className="text-lg font-semibold">{d.privateServersTitle}</h2>
              <p className="text-sm text-muted-foreground">{d.privateServersSubtitle}</p>
            </div>
          </FadeIn>
        )}

        {privateServers.map((server, i) => {
          const Icon = ICON_MAP[server.icon] ?? Download
          const meta = d.servers[server.id as keyof typeof d.servers]
          return (
            <FadeIn key={server.id} delay={0.2 + i * 0.05}>
              <Card>
                <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="font-medium">{meta.name}</h2>
                      <p className="text-sm text-muted-foreground">{meta.desc}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full shrink-0 sm:w-auto"
                    asChild
                  >
                    <a href={server.url} target="_blank" rel="noopener noreferrer">
                      {d.downloadApk}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          )
        })}

        <FadeIn delay={0.2 + privateServers.length * 0.05 + 0.05}>
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
