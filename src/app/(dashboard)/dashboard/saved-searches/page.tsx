import { createClient } from '@/utils/supabase/server'
import React, { Suspense } from 'react'
import { SavedSearches } from './_components/saved-searches'
import { SavedSearchesSkeleton } from '@/components/skeletons/saved-searches-skeleton'

const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your saved searches.</div>
  }
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Saved Searches</h2>
        <p className='text-muted-foreground'>
          Manage your saved searches for quick access.
        </p>
      </div>

      <Suspense fallback={<SavedSearchesSkeleton />}>
        <SavedSearches userId={user.id} />
      </Suspense>
    </div>
  )
}

export default Page
