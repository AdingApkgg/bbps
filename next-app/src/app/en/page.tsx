import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME_EN, SITE_DESCRIPTION_EN } from '@/lib/site'
import { HeroSection } from '@/components/hero-section'
import { CtaSection } from '@/components/cta-section'

export const metadata: Metadata = {
  title: SITE_NAME_EN,
  description: SITE_DESCRIPTION_EN,
  alternates: {
    canonical: `${SITE_URL}/en/`,
    languages: { 'zh-CN': `${SITE_URL}/` }
  },
  openGraph: {
    title: SITE_NAME_EN,
    description: SITE_DESCRIPTION_EN,
    url: `${SITE_URL}/en/`,
    locale: 'en_US'
  }
}

export default function EnHomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CtaSection />
    </div>
  )
}
