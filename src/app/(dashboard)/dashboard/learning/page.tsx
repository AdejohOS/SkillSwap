import { Button } from '@/components/ui/button'

import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { LearningRequestsList } from './_components/learning-requests-list'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LearningRequestsEmptyState } from './_components/learning-requests-empty-state'

export const dynamic = 'force-dynamic'
const Page = async () => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's learning requests with category information
  const { data: requests, error } = await supabase
    .from('skill_requests')
    .select(
      `
      *,
      skill_categories (
        id,
        name
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching learning requests:', error)
    return (
      <div className='p-4'>
        Error loading learning requests. Please try again later.
      </div>
    )
  }

  // Get user's credit balance
  const { data: creditData } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  const creditBalance = creditData?.balance || 0

  // For each request, get exchange statistics and check for matches
  const requestsWithExchanges = await Promise.all(
    requests.map(async request => {
      // Get exchanges for this request
      const { data: exchangeData, error: exchangeError } = await supabase.rpc(
        'get_exchanges_by_skill_request',
        {
          request_id: request.id
        }
      )

      if (exchangeError) {
        console.error('Error fetching exchanges:', exchangeError)
        return {
          ...request,

          exchange_count: 0,
          active_exchanges: 0,
          pending_exchanges: 0,
          has_matches: false
        }
      }

      const activeExchanges =
        exchangeData?.filter(ex =>
          ['accepted', 'in_progress'].includes(ex.exchange_status)
        ) || []

      const pendingExchanges =
        exchangeData?.filter(ex => ex.exchange_status === 'pending') || []

      // Check if there are potential matches for this request
      const { data: matchData } = await supabase
        .from('skill_offerings')
        .select('id')
        .eq('is_active', true)
        .neq('user_id', user.id)
        .eq('category_id', request.category_id || '')
        .limit(1)

      return {
        ...request,
        exchange_count: exchangeData?.length || 0,
        active_exchanges: activeExchanges.length,
        pending_exchanges: pendingExchanges.length,
        has_matches: matchData && matchData.length > 0
      }
    })
  )
  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            My Learning Requests
          </h1>
          <p className='text-muted-foreground'>
            Manage the skills you want to learn from others.
          </p>
        </div>
        <Button asChild>
          <Link href='/dashboard/learning/new'>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Request
          </Link>
        </Button>
      </div>

      {requestsWithExchanges.length > 0 ? (
        <LearningRequestsList
          requests={requestsWithExchanges}
          userId={user.id}
          creditBalance={creditBalance}
        />
      ) : (
        <LearningRequestsEmptyState />
      )}
    </div>
  )
}

export default Page
