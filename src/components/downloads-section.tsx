'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Download,
  HardDrive,
  Sparkles,
  Cat,
  Flower2,
  CloudFog,
  Monitor,
  Apple,
  Smartphone
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FadeIn } from '@/components/motion'
import privateServers from '@/data/private-servers.json'

const DOWNLOAD_URL = 'https://30hb.cn/latest'
const DRIVE_URL = 'https://drive.saop.cc/%E7%99%BD%E9%B9%85%E7%BD%91%E7%9B%98'

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  cat: Cat,
  'flower-2': Flower2,
  'cloud-fog': CloudFog
}

/* 下载页
 *
 * HIG 版式：左对齐大标题 + 说明；安装教程是编号的 inset 列表（步骤本身就是
 * 有序列表，用 1/2/3 的圆形序号），服务器是带图标的行，动作按钮在行尾。
 * 全文没有卡片，只有分组容器和行分隔线。
 */

/** 分组抬头：13px 次要色，缩进与行内容对齐 */
function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 px-4 text-label font-semibold text-(--hig-color-label-secondary)">
      {children}
    </h2>
  )
}

export function DownloadsSection() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const d = dict.downloads

  return (
    <div className="container-page max-w-2xl pt-8 pb-16 md:pt-12 md:pb-24">
      <FadeIn eager>
        <h1 className="text-display-lg">{d.title}</h1>
        <p className="mt-1 text-headline-sm text-(--hig-color-label-secondary)">{d.subtitle}</p>
      </FadeIn>

      {/* 安装教程 */}
      <FadeIn delay={0.1} className="mt-8">
        <GroupTitle>{d.guideTitle}</GroupTitle>
        <p className="mb-3 px-4 text-label text-(--hig-color-label-secondary)">{d.guideSubtitle}</p>

        <Tabs defaultValue="android" className="w-full">
          <TabsList className="mx-4 grid w-[calc(100%-2rem)] grid-cols-3">
            <TabsTrigger value="android" className="gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">{d.guide.android.label}</span>
              <span className="sm:hidden">Android</span>
            </TabsTrigger>
            <TabsTrigger value="apple" className="gap-2">
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">{d.guide.apple.label}</span>
              <span className="sm:hidden">iOS</span>
            </TabsTrigger>
            <TabsTrigger value="windows" className="gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">{d.guide.windows.label}</span>
              <span className="sm:hidden">Win</span>
            </TabsTrigger>
          </TabsList>

          {(['android', 'apple', 'windows'] as const).map((platform) => (
            <TabsContent key={platform} value={platform}>
              <ol
                data-list-group
                className="mt-3 overflow-hidden rounded-sm bg-(--hig-color-surface-02)"
              >
                {d.guide[platform].steps.map((step: string, i: number) => (
                  <li key={i} data-list-item className="flex gap-3 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--hig-color-fill-subtle) text-label font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-body-02 leading-relaxed text-(--hig-color-label-secondary)">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          ))}
        </Tabs>
      </FadeIn>

      {/* 客户端与私服：同一张列表，行尾是动作 */}
      <div className="mt-10">
        <GroupTitle>{locale === 'zh' ? '客户端' : 'Clients'}</GroupTitle>
        {/* 行就是 FadeIn 本身：motion.div 夹在 ul>li 之间会让 `[data-list-group] [data-list-item]`
            选不到行、分隔线失效（display:contents 又会让 opacity/位移动画失效），
            所以这里用 div 当列表容器，行类直接挂在 FadeIn 上。 */}
        <div data-list-group className="overflow-hidden rounded-sm bg-(--hig-color-surface-02)">
          <FadeIn
            data-list-item
            delay={0.15}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-(--hig-color-fill-subtle)">
                <Download className="h-5 w-5" />
              </span>
              <div>
                <p className="text-body-02 font-semibold">{d.primary}</p>
                <p className="text-label text-(--hig-color-label-secondary)">
                  {locale === 'zh' ? '蚕豆私服推荐客户端' : 'Recommended client'}
                </p>
              </div>
            </div>
            <Button className="w-full shrink-0 sm:w-auto" asChild>
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                {d.primary}
              </a>
            </Button>
          </FadeIn>

          {privateServers.map((server, i) => {
            const Icon = ICON_MAP[server.icon] ?? Download
            const meta = d.servers[server.id as keyof typeof d.servers]
            return (
              <FadeIn
                key={server.id}
                data-list-item
                delay={0.2 + i * 0.05}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-(--hig-color-fill-subtle)">
                    <Icon className="h-5 w-5 text-(--hig-color-label-secondary)" />
                  </span>
                  <div>
                    <p className="text-body-02 font-semibold">{meta.name}</p>
                    <p className="text-label text-(--hig-color-label-secondary)">{meta.desc}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full shrink-0 sm:w-auto" asChild>
                  <a href={server.url} target="_blank" rel="noopener noreferrer">
                    {d.downloadApk}
                  </a>
                </Button>
              </FadeIn>
            )
          })}

          <FadeIn
            data-list-item
            delay={0.2 + privateServers.length * 0.05 + 0.05}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-(--hig-color-fill-subtle)">
                <HardDrive className="h-5 w-5 text-(--hig-color-label-secondary)" />
              </span>
              <div>
                <p className="text-body-02 font-semibold">{d.moreServers}</p>
                <p className="text-label text-(--hig-color-label-secondary)">
                  {locale === 'zh' ? '网盘与其它服务器' : 'Drive & other servers'}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full shrink-0 sm:w-auto" asChild>
              <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer">
                {dict.nav.drive}
              </a>
            </Button>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
