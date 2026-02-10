import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import { HeroSection } from '@/components/hero-section'
import { IntroTabs } from '@/components/intro-tabs'
import { CtaSection } from '@/components/cta-section'
import { MapsShowcase } from '@/components/maps-showcase'
import { CreativeShowcase } from '@/components/creative-showcase'
import { FeaturesZigzag } from '@/components/features-zigzag'

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: { en: `${SITE_URL}/en/` }
  },
  openGraph: {
    title: `${SITE_NAME} | 海岛奇兵私服`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`
  }
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <IntroTabs />
      <FeaturesZigzag />
      <CtaSection />
      <MapsShowcase />
      <CreativeShowcase />
    </div>
  )
}
