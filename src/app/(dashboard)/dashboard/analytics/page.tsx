import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsHeader } from './_components/analytics-header'
import { AnalyticsTabs } from './_components/analytics-tabs'

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
    <div className='min-h-full space-y-6 p-4'>
      <AnalyticsHeader />
      <AnalyticsTabs />
    </div>
  )
}

export default Page
