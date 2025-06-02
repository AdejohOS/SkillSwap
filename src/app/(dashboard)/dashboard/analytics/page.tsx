import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsHeader } from './_components/analytics-header'
import { AnalyticsTabs } from './_components/analytics-tabs'
import { Suspense } from 'react'
import { AnalyticsHeaderSkeleton } from './_components/analytics-header-skeleton'

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
    <div className='space-y-8 p-4'>
      <Suspense fallback={<AnalyticsHeaderSkeleton />}>
        <AnalyticsHeader />
      </Suspense>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsTabs />
      </Suspense>
    </div>
  )
}

export default Page
