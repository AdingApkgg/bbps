import type { Metadata } from 'next'
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
import { SiteHtml, shellMetadata } from '@/components/site-shell'
import { MotionProvider } from '@/components/motion-provider'
import '@/app/globals.css'

/**
 * 英文站根 layout：与 (zh)/layout.tsx 同构，只有 lang 和根元数据分叉。
 *
 * 原来 `/en/**` 没有自己的 layout，继承根 layout 的 `lang="zh-Hans"` 和中文
 * title 模板 `%s | 蚕豆私服` —— 15 个英文页的 <html> 全是中文标记，社交卡片
 * 标题也是中英混排。
 */
export const metadata: Metadata = shellMetadata('en')
export { viewport } from '@/components/site-shell'

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteHtml lang="en">
      <MotionProvider>
        <LocaleProvider>
          <MusicPlayerProvider>
            <div className="relative flex min-h-svh flex-col">
              <Navbar />
              <LocaleSuggestBar />
              <SitePivot />
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
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
      </MotionProvider>
    </SiteHtml>
  )
}
