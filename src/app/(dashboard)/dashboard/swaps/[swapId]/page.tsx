import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { SwapActions } from '../_components/swap-actions'
import { SwapScheduler } from '../_components/swap-scheduler'
import { SwapMessages } from '../_components/swap-messages'

const Page = async ({ params }: { params: Promise<{ swapId: string }> }) => {
  const { swapId } = await params

  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view this swap.</div>
  }

  // Fetch the swap
  const { data: swap, error } = await supabase
    .from('swaps')
    .select(
      `
      id, 
      status, 
      created_at,
      updated_at,
      scheduled_times,
      agreement_details,
      notes,
      teacher_id,
      learner_id,
      teacher_rating,
      learner_rating,
      teacher_feedback,
      learner_feedback,
      skill_offerings(id, title, description, user_id),
      skill_requests(id, title, description, user_id)
    `
    )
    .eq('id', swapId)
    .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
    .single()

  if (error || !swap) {
    notFound()
  }

  const isTeacher = swap.teacher_id === user.id
  const otherUserId = isTeacher ? swap.learner_id : swap.teacher_id

  const { data: otherUser } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, bio')
    .eq('id', otherUserId)
    .single()

  if (!otherUser) {
    return <div>Error loading user profile. Please try again later.</div>
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Swap Details</h2>
          <p className='text-muted-foreground'>
            Manage your skill exchange with {otherUser.username}.
          </p>
        </div>
        <Badge
          className='px-3 py-1 text-sm'
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
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Swap Information</CardTitle>
            <CardDescription>Details about this skill exchange</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-12 w-12'>
                <AvatarImage
                  src={
                    otherUser.avatar_url ||
                    '/placeholder.svg?height=48&width=48'
                  }
                  alt={otherUser.username}
                />
                <AvatarFallback>
                  {otherUser.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium'>{otherUser.username}</p>
                <p className='text-muted-foreground text-xs'>
                  {isTeacher ? 'Your student' : 'Your teacher'}
                </p>
              </div>
              <Button variant='outline' size='sm' className='ml-auto' asChild>
                <Link href={`/dashboard/profile/${otherUser.id}`}>
                  View Profile
                </Link>
              </Button>
            </div>

            <DottedSeparator />

            <div>
              <h4 className='mb-1 text-sm font-semibold'>
                You {isTeacher ? 'teach' : 'learn'}:
              </h4>
              <p className='text-sm font-medium'>
                {isTeacher
                  ? swap.skill_offerings?.title
                  : swap.skill_requests?.title}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {isTeacher
                  ? swap.skill_offerings?.description
                  : swap.skill_requests?.description}
              </p>
            </div>

            <div>
              <h4 className='mb-1 text-sm font-semibold'>
                {otherUser.username} {isTeacher ? 'learns' : 'teaches'}:
              </h4>
              <p className='text-sm font-medium'>
                {isTeacher
                  ? swap.skill_requests?.title
                  : swap.skill_offerings?.title}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                {isTeacher
                  ? swap.skill_requests?.description
                  : swap.skill_offerings?.description}
              </p>
            </div>

            {swap.agreement_details && (
              <div>
                <h4 className='mb-1 text-sm font-semibold'>
                  Agreement Details:
                </h4>
                <p className='text-sm'>{swap.agreement_details}</p>
              </div>
            )}

            <div className='text-muted-foreground flex items-center text-sm'>
              <Clock className='mr-2 h-4 w-4' />
              <span>
                Created{' '}
                {swap.created_at
                  ? new Date(swap.created_at).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>

            {Array.isArray(swap.scheduled_times) &&
              swap.scheduled_times.length > 0 && (
                <div>
                  <h4 className='mb-1 text-sm font-semibold'>
                    Scheduled Sessions:
                  </h4>
                  <ul className='space-y-2'>
                    {swap.scheduled_times.map((time: any, index: number) => {
                      if (
                        typeof time === 'string' ||
                        typeof time === 'number'
                      ) {
                        return (
                          <li key={index} className='flex items-center text-sm'>
                            <Calendar className='text-muted-foreground mr-2 h-4 w-4' />
                            <span>{new Date(time).toLocaleString()}</span>
                          </li>
                        )
                      }
                      return null
                    })}
                  </ul>
                </div>
              )}
          </CardContent>
          <CardFooter className='flex flex-col items-stretch space-y-2'>
            <SwapActions
              swap={swap}
              isTeacher={isTeacher}
              otherUser={otherUser}
            />
          </CardFooter>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Schedule a Session</CardTitle>
              <CardDescription>
                Arrange your next learning session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SwapScheduler
                swap={swap}
                disabled={
                  swap.status !== 'accepted' && swap.status !== 'in_progress'
                }
              />
            </CardContent>
          </Card>

          <Card className='flex h-[400px] flex-col'>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Communicate with {otherUser.username}
              </CardDescription>
            </CardHeader>
            <SwapMessages swapId={swap.id} otherUser={otherUser} />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
