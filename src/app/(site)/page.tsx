import { CoreFeatures } from '@/components/core-features'
import { CreditSystem } from '@/components/credit-system'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { JoinCommunity } from '@/components/join-community'

export const dynamic = 'force-dynamic'
export default function Home() {
  return (
    <section className=''>
      <Hero />
      <HowItWorks />
      <CreditSystem />

      <CoreFeatures />
      <JoinCommunity />
    </section>
  )
}
