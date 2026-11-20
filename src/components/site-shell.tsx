import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_LOGO,
  SITE_LOCALE,
  SITE_LOCALE_ALT,
  SITE_METADATA_BASE,
  SITE_NAME,
  SITE_URL
} from '@/lib/site'
import { THEME_SCRIPT } from '@/lib/theme'

/*
 * 中英两套根 layout 的共用外壳。
 *
 * 站点用 Next 的多根 layout（route group 各自带 <html>）：静态导出没有服务端协商，
 * lang 只能是构建期常量，一个根 layout 同时包住中英文就只能全站写死一个值。
 * 代价是 <html>/<body>、字体、globals.css、metadataBase 这些要由两个 layout 各写一次 ——
 * 所以统一收到这里，两边各调一次。
 */

/* 中文字形按 unicode-range 拆成子集按需加载，体积大且非首屏关键，不做 preload */
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: false
})

/** OG 图上方形 logo 的真实尺寸（横图，social card 标准比），别写成正方形 */
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/* 浏览器 UI 底色 = systemGroupedBackground 的亮/暗值，与 --md-sys-color-surface 一致 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f2f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

/** <html> + skip link + <body> 的外壳，中英各传各的 lang */
export function SiteHtml({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html
      // BCP 47：中文内容的实质差别是简繁而非国别，W3C i18n 建议用文字子标签。
      // 注意这只管「内容是什么语言」；og:locale 和 toLocaleString 各有各的格式要求
      lang={lang}
      suppressHydrationWarning
      className={notoSansSC.variable}
    >
      {/* `next/head` 是 Pages Router 的东西，App Router 的根 layout 就该直接写 <head>：
          防闪脚本必须在水合之前同步执行，`next/script` 的 beforeInteractive 在静态导出里
          拿不到这个保证。 */}
      {/* biome-ignore lint/style/noHeadElement: 见上 */}
      <head>
        {/* 防闪串必须在水合前同步执行，`next/script` 在静态导出拿不到这个保证，
            只能内联。两个检查器都要注释，且都要求注释在紧邻的上一行，故用范围抑制。 */}
        {/* biome-ignore-start lint/security/noDangerouslySetInnerHtml: 常量脚本，无外部输入 */}
        <script
          // pi-lens-ignore: dangerously-set-inner-html -- 内容是 src/lib/theme.ts 的常量，无外部输入
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        {/* biome-ignore-end lint/security/noDangerouslySetInnerHtml: 常量脚本，无外部输入 */}
        {/* 系统跟随的那两条带 media，手动选定后要拆掉 —— 见 src/lib/theme.ts */}
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main"
          data-skip-link
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--md-sys-layer-skip) focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-button focus:text-on-primary"
        >
          {lang === 'en' ? 'Skip to main content' : '跳至主内容'}
        </a>
        {children}
      </body>
    </html>
  )
}

/**
 * 完整根元数据，按语言分叉。
 *
 * title 模板必须跟着语言走：英文页继承 `%s | 蚕豆私服` 会输出 `Music | 蚕豆私服`
 * 这种中英混排；og:locale / siteName / twitter 同理。hreflang 三行两版一致。
 */
export function shellMetadata(lang: 'zh-Hans' | 'en'): Metadata {
  const isEn = lang === 'en'
  const canonical = isEn ? `${SITE_URL}/en/` : `${SITE_URL}/`
  const defaultTitle = isEn ? 'Boom Beach Private Server' : `${SITE_NAME} | 海岛奇兵私服`
  const description = isEn ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION

  return {
    metadataBase: SITE_METADATA_BASE,
    title: {
      default: defaultTitle,
      template: isEn ? '%s | Horsebean Private Server' : `%s | ${SITE_NAME}`
    },
    description,
    alternates: {
      canonical,
      languages: {
        zh: `${SITE_URL}/`,
        en: `${SITE_URL}/en/`,
        'x-default': `${SITE_URL}/en/`
      },
      types: {
        'application/rss+xml': `${SITE_URL}/feed.xml`
      }
    },
    openGraph: {
      type: 'website',
      locale: isEn ? SITE_LOCALE_ALT : SITE_LOCALE,
      alternateLocale: isEn ? SITE_LOCALE : SITE_LOCALE_ALT,
      url: canonical,
      siteName: isEn ? 'Horsebean Private Server' : SITE_NAME,
      title: defaultTitle,
      description,
      images: [{ url: SITE_LOGO, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: SITE_NAME }]
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      images: [SITE_LOGO]
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
}
