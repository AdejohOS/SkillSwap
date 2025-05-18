import { ArrowLeftRight, BookOpen, Lightbulb, Star } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'

interface StatsCardsProps {
  userId: string
}

export const StatsCards = async ({ userId }: StatsCardsProps) => {
  const supabase = await createClient()

  // Get skills count
  const { count: skillsCount } = await supabase
    .from('skill_offerings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get learning requests count
  const { count: requestsCount } = await supabase
    .from('skill_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get active exchanges count
  const { count: exchangesCount } = await supabase
    .from('exchanges')
    .select('*', { count: 'exact', head: true })
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .in('status', ['accepted', 'in_progress'])

  // Get average rating
  const { data: ratingData } = await supabase.rpc('get_user_average_rating', {
    user_id: userId
  })

  const averageRating = ratingData || 0

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Skills Offered</CardTitle>
          <Lightbulb className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{skillsCount || 0}</div>
          <p className='text-muted-foreground text-xs'>
            Skills you can teach others
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Learning Requests
          </CardTitle>
          <BookOpen className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{requestsCount || 0}</div>
          <p className='text-muted-foreground text-xs'>
            Skills you want to learn
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Active Exchanges
          </CardTitle>
          <ArrowLeftRight className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{exchangesCount || 0}</div>
          <p className='text-muted-foreground text-xs'>
            Ongoing skill exchanges
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
          <Star className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{averageRating.toFixed(1)}</div>
          <p className='text-muted-foreground text-xs'>
            Based on exchange reviews
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
