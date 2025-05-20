import React, { Suspense } from 'react'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { StatsCardsSkeleton } from '@/components/skeletons/stats-cards-skeleton'
import { CreditBalance } from './_components/credit-balance'
import { StatsCards } from './_components/stats-cards'
import { RecentExchanges } from './_components/recent-exchanges'
import { RecentExchangesSkeleton } from '@/components/skeletons/recent-exchanges-skeleton'
import { RecommendedMatches } from './_components/recomended-matches'
import { RecommendedMatchesSkeleton } from '@/components/skeletons/recommended-matches-skeleton'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }
  return (
    <div className='min-h-full p-4'>
      <div className='flex flex-col gap-5'>
        <div className='flex justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
            <p className='text-muted-foreground'>
              An overview of your SkillSwap experience.
            </p>
          </div>

          <CreditBalance userId={user.id} />
        </div>

        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards userId={user.id} />
        </Suspense>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Suspense fallback={<RecentExchangesSkeleton />}>
              <RecentExchanges userId={user.id} />
            </Suspense>
          </div>
          <div className='col-span-3'>
            <Suspense fallback={<RecommendedMatchesSkeleton />}>
              <RecommendedMatches userId={user.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
