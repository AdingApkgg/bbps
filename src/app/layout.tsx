import type { Metadata, Viewport } from 'next'
import { Noto_Sans, Noto_Sans_SC } from 'next/font/google'
import { LocaleProvider } from '@/contexts/locale-context'
import { MusicPlayerProvider } from '@/contexts/music-player-context'
import { Navbar } from '@/components/navbar'
import { LocaleSuggestBar } from '@/components/locale-suggest-bar'
import { Footer } from '@/components/footer'
import { MusicPlayerBar, PlayerSpacer } from '@/components/music-player-bar'
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LOCALE_ALT,
  SITE_LOGO
} from '@/lib/site'
import '@/app/globals.css'

/* 可变字体（wght 轴），构建时从 Google Fonts 下载并自托管到 _next/static/media */
const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-noto-sans',
  display: 'swap'
})

/* 中文字形按 unicode-range 拆成子集按需加载，体积大且非首屏关键，不做 preload */
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 海岛奇兵私服`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME
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
      'en': `${SITE_URL}/en`,
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f8ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a121a' }
  ]
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
      className={`${notoSans.variable} ${notoSansSC.variable}`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE_NAME}
          href={`${SITE_URL}/feed.xml`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: 'if(location.hostname!==\'localhost\'&&\'serviceWorker\'in navigator){window.addEventListener(\'load\',function(){navigator.serviceWorker.register(\'/sw.js\')})}'
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LocaleProvider>
          <MusicPlayerProvider>
            <div className="relative flex min-h-svh flex-col">
              <Navbar />
              <LocaleSuggestBar />
              <main className="flex-1">{children}</main>
              <Footer />
              <PlayerSpacer />
            </div>
            <MusicPlayerBar />
          </MusicPlayerProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
