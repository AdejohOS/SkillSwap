import { ReciprocalMatchesSkeleton } from '@/components/skeletons/reciprocal-matches-skeleton'
import { createClient } from '@/utils/supabase/server'
import React, { Suspense } from 'react'
import { ReciprocalMatches } from '../_components/reciprocal-matches'

const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to find exchange partners.</div>
  }
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Find Exchange Partners
        </h2>
        <p className='text-muted-foreground'>
          Discover users who can teach you skills while learning from you -
          perfect skill exchange matches.
        </p>
      </div>

      <Suspense fallback={<ReciprocalMatchesSkeleton />}>
        <ReciprocalMatches userId={user.id} />
      </Suspense>
    </div>
  )
}

export default Page
