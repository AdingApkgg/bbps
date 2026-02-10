import { HeroSection } from '@/components/hero-section'
import { ServerStats } from '@/components/server-stats'
import { CtaSection } from '@/components/cta-section'
import { CommentsSection } from '@/components/comments-section'

export default function EnHomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ServerStats />
      <CtaSection />
      <CommentsSection />
    </div>
  )
}
