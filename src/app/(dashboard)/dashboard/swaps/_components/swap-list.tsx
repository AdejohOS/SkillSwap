import Link from 'next/link'
import { Calendar, Clock, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { createClient } from '@/utils/supabase/server'
import { SwapsEmptyState } from './swaps-empty-state'

export const SwapsList = async ({
  status = 'all'
}: {
  status?: 'active' | 'pending' | 'completed' | 'all'
}) => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your swaps.</div>
  }

  // Query to get the user's swaps
  let query = supabase
    .from('swaps')
    .select(
      `
      id, 
      status, 
      created_at,
      scheduled_times,
      teacher_id,
      learner_id,
      skill_offerings(id, title, user_id),
      skill_requests(id, title, user_id)
    `
    )
    .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  // Filter by status if needed
  if (status === 'active') {
    query = query.in('status', ['accepted', 'in_progress'])
  } else if (status === 'pending') {
    query = query.eq('status', 'pending')
  } else if (status === 'completed') {
    query = query.eq('status', 'completed')
  }

  const { data: swaps, error } = await query

  if (error) {
    console.error('Error fetching swaps:', error)
    return <div>Error loading swaps. Please try again later.</div>
  }

  if (!swaps || swaps.length === 0) {
    return <SwapsEmptyState status={status} />
  }

  // Get all user IDs involved in swaps
  const userIds = new Set<string>()
  swaps.forEach(swap => {
    userIds.add(swap.teacher_id)
    userIds.add(swap.learner_id)
  })

  // Get user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', Array.from(userIds))

  const profileMap = (profiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, any>
  )

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {swaps.map(swap => {
        const isTeacher = swap.teacher_id === user.id
        const otherUserId = isTeacher ? swap.learner_id : swap.teacher_id
        const otherUser = profileMap[otherUserId]

        const userSkill = isTeacher
          ? swap.skill_offerings?.title
          : swap.skill_requests?.title
        const otherSkill = isTeacher
          ? swap.skill_requests?.title
          : swap.skill_offerings?.title

        return (
          <Card key={swap.id} className='flex flex-col'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0'>
              <div className='flex items-start space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={
                      otherUser?.avatar_url ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={otherUser?.username}
                  />
                  <AvatarFallback>
                    {otherUser?.username?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-base'>
                    {otherUser?.username}
                  </CardTitle>
                  <CardDescription>
                    {isTeacher ? "You're teaching" : "You're learning"}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  swap.status === 'pending'
                    ? 'outline'
                    : swap.status === 'completed'
                      ? 'secondary'
                      : 'default'
                }
              >
                {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-semibold'>
                    You {isTeacher ? 'teach' : 'learn'}:
                  </h4>
                  <p className='text-sm'>{userSkill}</p>
                </div>
                <div>
                  <h4 className='text-sm font-semibold'>
                    {otherUser?.username} {isTeacher ? 'learns' : 'teaches'}:
                  </h4>
                  <p className='text-sm'>{otherSkill}</p>
                </div>
                {Array.isArray(swap.scheduled_times) &&
                  swap.scheduled_times.length > 0 && (
                    <div className='text-muted-foreground flex items-center text-sm'>
                      <Calendar className='mr-2 h-4 w-4' />
                      <span>
                        Next session:{' '}
                        {swap.scheduled_times[0]
                          ? new Date(
                              swap.scheduled_times[0] as string | number
                            ).toLocaleString()
                          : 'N/A'}
                      </span>
                    </div>
                  )}
                <div className='text-muted-foreground flex items-center text-sm'>
                  <Clock className='mr-2 h-4 w-4' />
                  <span>
                    Created{' '}
                    {swap.created_at
                      ? new Date(swap.created_at).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between border-t pt-4'>
              <Button variant='outline' asChild>
                <Link href={`/dashboard/profile/${otherUserId}`}>
                  View Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/swaps/${swap.id}`}>
                  <MessageSquare className='mr-2 h-4 w-4' />
                  Manage Swap
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
