import { CoreFeaturesSection } from '@/components/core-features-section'
import { CreditSystem } from '@/components/credit-system'
import { Hero } from '@/components/hero'
import { HowItWorksSection } from '@/components/how-it-works'

import { JoinCommunity } from '@/components/join-community'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials'

export const dynamic = 'force-dynamic'
export default function Home() {
  return (
    <section className=''>
      <Hero />
      <HowItWorksSection />

      <CoreFeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <JoinCommunity />
    </section>
  )
}
