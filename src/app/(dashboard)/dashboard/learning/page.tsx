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

  // Get the user's credit balance using direct table query
  const { data: creditData } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  const creditBalance = creditData?.balance || 0

  // For each request, get exchange statistics with better error handling
  const requestsWithExchanges = await Promise.all(
    requests.map(async request => {
      try {
        const { data: exchangeData, error: exchangeError } = await supabase.rpc(
          'get_exchanges_by_skill_request',
          {
            request_id: request.id
          }
        )

        if (exchangeError) {
          console.error(
            'Error fetching exchanges for request:',
            request.id,
            exchangeError
          )
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

        return {
          ...request,
          exchange_count: exchangeData?.length || 0,
          active_exchanges: activeExchanges.length,
          pending_exchanges: pendingExchanges.length,
          has_matches: exchangeData && exchangeData.length > 0
        }
      } catch (err) {
        console.error(
          'Exception fetching exchanges for request:',
          request.id,
          err
        )
        return {
          ...request,
          exchange_count: 0,
          active_exchanges: 0,
          pending_exchanges: 0,
          has_matches: false
        }
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
            Add Learning Request
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
