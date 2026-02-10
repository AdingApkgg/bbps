import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { LocaleProvider } from '@/contexts/locale-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LOCALE_ALT,
  SITE_LOGO
} from '@/lib/site'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 海岛奇兵私服`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
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
      'zh-CN': SITE_URL,
      'en': `${SITE_URL}/en`
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider>
            <div className="relative flex min-h-svh flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
