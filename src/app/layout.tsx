import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Roboto, Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'
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
import { SKIN_BOOT_SCRIPT, STYLE_BOOT_SCRIPT } from '@/components/skin-switcher'
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

/* Roboto 是 Material Design 2 的正文 / 标题字体，构建时下载并自托管到 _next/static/media。
   Roboto 不含汉字，中文由后面的 Noto Sans SC 接住（同一 fallback 链）。
   只取 400/500/700 三档：M2 的字重梯度是 regular / medium / bold，多拉一档都是白搭体积。 */
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  variable: '--font-roboto',
  display: 'swap'
})

/* M2 的代码字体（Roboto Mono） */
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono',
  display: 'swap',
  preload: false
})

/* 皮肤字体自托管：Google Fonts 上没有 IBM Plex Sans 的 next/font 入口、也没有 Selawik，
   下载 woff2 走 localFont。两者只含拉丁字形，中文仍由 Noto Sans SC 接住。
   preload:false 是因为默认 M2 皮肤不用它们。 */
const plexSans = localFont({
  src: [
    { path: './fonts/plex-sans-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plex-sans-600.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-plex-sans',
  display: 'swap',
  preload: false,
  fallback: ['Segoe UI', 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif']
})

const selawik = localFont({
  src: [
    { path: './fonts/selawik-regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/selawik-semibold.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-selawik',
  display: 'swap',
  preload: false,
  fallback: ['Segoe UI', 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif']
})

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

/** 各皮肤的浏览器 UI 底色（= 对应 css 的 --md-sys-color-surface，亮/暗），用于首帧前重写 theme-color */
const THEME_COLORS: Record<string, readonly [string, string]> = {
 m2: ['#fafafa', '#121212'],
 fluent: ['#faf9f8', '#1f1f1f'],
 carbon: ['#f4f4f4', '#262626'],
 apple: ['#f2f2f7', '#000000']
}

/** 首帧前把 theme-color 改成当前皮肤的 surface；皮肤切换时也跑 */
const THEME_COLOR_SCRIPT = `
(function(){var m=${JSON.stringify(THEME_COLORS)};var put=function(){
var k=document.documentElement.dataset.skin||'apple';var dark=matchMedia('(prefers-color-scheme: dark)').matches;
var c=(m[k]||m.apple)[dark?1:0];var n=document.querySelectorAll('meta[name="theme-color"]');
if(!n.length){n=[document.createElement('meta')];n[0].name='theme-color';document.head.appendChild(n[0])}
for(var i=0;i<n.length;i++)n[i].setAttribute('content',c)};
put();document.addEventListener('bbps:skin',put);
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',put)}catch(e){}})()
`

export const viewport: Viewport = {
 // 兜底取默认皮肤（Apple HIG）的 surface；其余皮肤由 head 里的
 // THEME_COLOR_SCRIPT 在首帧前替换，取值见 THEME_COLORS。
 themeColor: [
 { media: '(prefers-color-scheme: light)', color: '#f2f2f7' },
 { media: '(prefers-color-scheme: dark)', color: '#000000' }
 ]
}

/** 内联 <script>。三处都是本文件里的静态常量（无用户输入），共用一处抑制注释 */
function InlineScript({ html }: { html: string }) {
  return (
    // pi-lens-ignore: dangerously-set-inner-html -- 三处都是本文件的静态常量，无用户输入
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
 className={`${roboto.variable} ${robotoMono.variable} ${notoSansSC.variable} ${plexSans.variable} ${selawik.variable}`}
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
      {/* 皮肤：首帧前回填 data-skin，避免闪默认皮肤 */}
      <InlineScript html={SKIN_BOOT_SCRIPT} />
      {/* 浏览器 UI 底色随皮肤（需在 data-skin 回填之后才能取到值） */}
      <InlineScript html={THEME_COLOR_SCRIPT} />
    </head>
    <body className="font-sans antialiased">
      <LocaleProvider>
        <MusicPlayerProvider>
          <a
            href="#main"
            data-skip-link
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-button focus:text-on-primary"
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
