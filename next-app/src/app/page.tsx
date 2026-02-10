import { HeroSection } from '@/components/hero-section'
import { CtaSection } from '@/components/cta-section'
import { MapsShowcase } from '@/components/maps-showcase'
import { CreativeShowcase } from '@/components/creative-showcase'

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CtaSection />
      <MapsShowcase />
      <CreativeShowcase />
    </div>
  )
}
