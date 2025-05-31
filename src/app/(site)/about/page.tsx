import React from 'react'
import { HeroSection } from './_components/hero-section'
import { MissionSection } from './_components/mission-section'
import { HowItWorksSection } from './_components/how-it-works-section'
import { FeaturesSection } from './_components/features-section'
import { CommunitySection } from './_components/community-section'
import { StatsSection } from './_components/stats-section'
import { CtaSection } from './_components/cta-section'

export const dynamic = 'force-dynamic'
const Page = () => {
  return (
    <section>
      <HeroSection />
      <MissionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CommunitySection />
      <StatsSection />
      <CtaSection />
    </section>
  )
}

export default Page
