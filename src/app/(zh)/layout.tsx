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
 * 中文站根 layout（多根 layout，route group 各自带 <html>）。
 *
 * 为什么不用唯一根 layout：`/en/**` 从来就是中文标记 —— 根 layout 的
 * `lang="zh-Hans"` 是常量，子路由无从覆盖。静态导出下没有 Accept-Language 协商，
 * 唯一解就是分段：`(zh)` 写 zh-Hans，`(en)` 写 en，共用外壳收在 site-shell.tsx。
 */
export const metadata: Metadata = shellMetadata('zh-Hans')
export { viewport } from '@/components/site-shell'

export default function ZhLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteHtml lang="zh-Hans">
      <MotionProvider>
        <LocaleProvider>
          <MusicPlayerProvider>
            <div className="relative flex min-h-svh flex-col">
              <Navbar />
              <LocaleSuggestBar />
              {/* 顶部枢轴：窄屏显示，宽屏由 CSS 隐藏 */}
              <SitePivot />
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
                {/* 左侧导航栏：宽屏显示，窄屏由 CSS 隐藏 */}
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
