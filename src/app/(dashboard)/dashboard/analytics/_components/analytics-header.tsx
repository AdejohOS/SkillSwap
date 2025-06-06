import { CalendarRange, Clock, Coins, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

import { createClient } from '@/utils/supabase/server'
import { DateRangePickerWrapper } from './date-range-picker-wrapper'

export const AnalyticsHeader = async () => {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Default stats in case user is not found or RPC fails
  let stats = {
    total_teaching_hours: 0,
    total_learning_hours: 0,
    total_swaps: 0,
    active_swaps: 0
  }

  // Get credit balance
  let creditBalance = 0

  // Only call RPC if user exists
  if (user) {
    const { data: summary } = await supabase.rpc('get_user_analytics_summary', {
      user_id: user.id
    })

    if (summary && summary.length > 0) {
      stats = summary[0]
    }

    // Get credit balance from credits table
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (credits) {
      creditBalance = credits.balance
    } else {
      // If no credit record exists, create one with default balance
      const { data: newCredit } = await supabase
        .from('credits')
        .insert({ user_id: user.id, balance: 5 })
        .select('balance')
        .single()

      if (newCredit) {
        creditBalance = newCredit.balance
      }
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Analytics</h2>
          <p className='text-muted-foreground'>
            Track your teaching and learning activities on SkillSwap
          </p>
        </div>
        <DateRangePickerWrapper />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <Clock className='h-5 w-5 text-blue-500' />
              <div>
                <p className='text-sm leading-none font-medium'>
                  Teaching Hours
                </p>
                <p className='text-2xl font-bold'>
                  {stats.total_teaching_hours}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <Clock className='h-5 w-5 text-green-500' />
              <div>
                <p className='text-sm leading-none font-medium'>
                  Learning Hours
                </p>
                <p className='text-2xl font-bold'>
                  {stats.total_learning_hours}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <Users className='h-5 w-5 text-purple-500' />
              <div>
                <p className='text-sm leading-none font-medium'>Total Swaps</p>
                <p className='text-2xl font-bold'>{stats.total_swaps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <CalendarRange className='h-5 w-5 text-orange-500' />
              <div>
                <p className='text-sm leading-none font-medium'>Active Swaps</p>
                <p className='text-2xl font-bold'>{stats.active_swaps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3'>
              <Coins className='h-5 w-5 text-amber-500' />
              <div>
                <p className='text-sm leading-none font-medium'>
                  Credit Balance
                </p>
                <p className='text-2xl font-bold'>{creditBalance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
