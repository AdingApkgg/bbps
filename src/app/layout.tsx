import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import { LocaleProvider } from '@/contexts/locale-context'
import { MusicPlayerProvider } from '@/contexts/music-player-context'
import { Navbar } from '@/components/navbar'
import { LocaleSuggestBar } from '@/components/locale-suggest-bar'
import { Footer } from '@/components/footer'
import { SitePivot } from '@/components/site-pivot'
import { SiteRail } from '@/components/site-rail'
import { SiteTabBar } from '@/components/site-tabbar'
import { MusicPlayerBar, PlayerSpacer } from '@/components/music-player-bar'
import { AppToaster } from '@/components/ui/toast-store'
import { STYLE_BOOT_SCRIPT } from '@/components/style-switcher'
import {
  SITE_URL,
  SITE_METADATA_BASE,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LOCALE_ALT,
  SITE_LOGO
} from '@/lib/site'
import '@/app/globals.css'

/* 中文字形按 unicode-range 拆成子集按需加载，体积大且非首屏关键，不做 preload */
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false
})

export const metadata: Metadata = {
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: `${SITE_NAME} | 海岛奇兵私服`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    alternateLocale: SITE_LOCALE_ALT,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 海岛奇兵私服`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_LOGO,
        width: 512,
        height: 512,
        alt: SITE_NAME
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} | 海岛奇兵私服`,
    description: SITE_DESCRIPTION,
    images: [SITE_LOGO]
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      zh: SITE_URL,
      en: `${SITE_URL}/en`,
      'x-default': `${SITE_URL}/en`
    },
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

/* 浏览器 UI 底色 = systemGroupedBackground 的亮/暗值，与 --md-sys-color-surface 一致 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

/** 内联 <script>。内容是本文件里的静态常量（无用户输入），共用一处抑制注释 */
function InlineScript({ html }: { html: string }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: 内容是本文件的静态常量，无用户输入
    <script dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      // BCP 47：中文内容的实质差别是简繁而非国别，W3C i18n 建议用文字子标签。
      // 注意这只管「内容是什么语言」；og:locale 和 toLocaleString 各有各的格式要求
      lang="zh-Hans"
      suppressHydrationWarning
      className={notoSansSC.variable}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE_NAME}
          href={`${SITE_URL}/feed.xml`}
        />
        {/* 样式修饰符（pointer / underline / compact / text-xl）：产物里是 :root[data-style] */}
        <InlineScript html={STYLE_BOOT_SCRIPT} />
      </head>
      <body className="font-sans antialiased">
        <LocaleProvider>
          <MusicPlayerProvider>
            <a
              href="#main"
              data-skip-link
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--md-sys-layer-skip) focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-button focus:text-on-primary"
            >
              跳至主内容
            </a>
            <div className="relative flex min-h-svh flex-col">
              <Navbar />
              <LocaleSuggestBar />
              {/* Fluent 枢轴 / Apple 工具栏分段：常驻 DOM，由皮肤 CSS 决定显示 */}
              <SitePivot />
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
                {/* 结构壳：Carbon 左栏导航在这里落地；其余皮肤只是普通容器 */}
                <div data-shell className="flex">
                  <SiteRail />
                  <div data-shell-main className="min-w-0 flex-1">
                    {children}
                  </div>
                </div>
              </main>
              <Footer />
              <PlayerSpacer />
            </div>
            <SiteTabBar />
            <MusicPlayerBar />
            <AppToaster />
          </MusicPlayerProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
