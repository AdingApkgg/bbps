import type { Metadata } from 'next'
import { SITE_DESCRIPTION_EN } from '@/lib/site'
import { HeroSection } from '@/components/hero-section'
import { IntroTabs } from '@/components/intro-tabs'
import { CtaSection } from '@/components/cta-section'
import { FeaturesZigzag } from '@/components/features-zigzag'
import { pageMetadata } from '@/lib/seo'

/* 英文首页原先用了 `Horsebean Private Server - Boom Beach Private Server`
 * 再被模板拼上站点名，尾巴重复；这里只留描述性主句。 */
export const metadata: Metadata = pageMetadata({
  path: 'en/',
  title: 'Boom Beach Private Server',
  description: SITE_DESCRIPTION_EN,
  absolute: true
})

export default function EnHomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <IntroTabs />
      <FeaturesZigzag />
      <CtaSection />
    </div>
  )
}
