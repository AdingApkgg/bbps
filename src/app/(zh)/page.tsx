import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'
import { HeroSection } from '@/components/hero-section'
import { IntroTabs } from '@/components/intro-tabs'
import { CtaSection } from '@/components/cta-section'
import { FeaturesZigzag } from '@/components/features-zigzag'
import { pageMetadata } from '@/lib/seo'

/* 首页标题已经自带站点名，absolute 免掉 `| 蚕豆私服` 的二次拼接 */
export const metadata: Metadata = pageMetadata({
  path: '',
  title: `${SITE_NAME} | 海岛奇兵私服`,
  description: SITE_DESCRIPTION,
  absolute: true
})

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <IntroTabs />
      <FeaturesZigzag />
      <CtaSection />
    </div>
  )
}
