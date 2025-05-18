import { ArrowLeftRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExchangeActions } from './exchange-actions'

interface SkillOffering {
  id: string
  title: string
  description: string | null
  user_id: string
}

interface Swap {
  id: string
  status: string
  scheduled_times: string[] | null
  teacher_id: string
  learner_id: string
  skill_offerings: SkillOffering | null
}

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

interface Exchange {
  id: string
  status: string
  created_at: string | null
  updated_at: string | null
  user1_id: string
  user2_id: string
  swap1_id: string | null
  swap2_id: string | null
  created_by: string | null
  user1: Profile
  user2: Profile
  swap1: Swap | null
  swap2: Swap | null
}

interface ExchangeDetailProps {
  exchange: Exchange
  currentUserId: string
  otherUser: Profile
}

export const ExchangeDetail = ({
  exchange,
  currentUserId,
  otherUser
}: ExchangeDetailProps) => {
  const isUser1 = exchange.user1_id === currentUserId

  // Get the skills being exchanged
  const mySwap = isUser1 ? exchange.swap1 : exchange.swap2
  const theirSwap = isUser1 ? exchange.swap2 : exchange.swap1

  // Format exchange status
  const getStatusColor = () => {
    switch (exchange.status) {
      case 'pending':
        return 'border-yellow-400 bg-yellow-50 text-yellow-700'
      case 'accepted':
        return 'border-blue-400 bg-blue-50 text-blue-700'
      case 'in_progress':
        return 'border-green-400 bg-green-50 text-green-700'
      case 'completed':
        return 'border-purple-400 bg-purple-50 text-purple-700'
      case 'rejected':
      case 'cancelled':
      default:
        return 'border-red-400 bg-red-50 text-red-700'
    }
  }

  return (
    <div className='space-y-6 p-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Exchange Summary</CardTitle>
              <CardDescription>
                Skill exchange with {otherUser.username}
              </CardDescription>
            </div>
            <Badge
              className={`uppercase ${getStatusColor()}`}
              variant='outline'
            >
              {exchange.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row'>
            <div className='flex items-start space-x-4'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={
                    otherUser.avatar_url ||
                    '/placeholder.svg?height=40&width=40'
                  }
                  alt={otherUser.username}
                />
                <AvatarFallback>
                  {otherUser.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-lg font-medium'>{otherUser.username}</h3>
                <p className='text-muted-foreground text-sm'>
                  Exchange Partner
                </p>
              </div>
            </div>

            <div className='text-muted-foreground flex items-center text-sm'>
              <Clock className='mr-2 h-4 w-4' />
              <span className='mr-1'>Created</span>
              {exchange.created_at ? (
                <time dateTime={exchange.created_at}>
                  {format(new Date(exchange.created_at), 'PPP')}
                </time>
              ) : (
                'Unknown'
              )}
            </div>
          </div>

          <div className='rounded-md border p-4'>
            <h3 className='mb-4 font-medium'>Exchange Details</h3>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <ArrowLeftRight className='h-4 w-4 rotate-180' />
                  <span>You teach</span>
                </div>
                <div className='bg-muted rounded-md p-3'>
                  <h4 className='font-medium'>
                    {mySwap?.skill_offerings?.title || 'Not specified'}
                  </h4>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <ArrowLeftRight className='h-4 w-4' />
                  <span>They teach</span>
                </div>
                <div className='bg-muted rounded-md p-3'>
                  <h4 className='font-medium'>
                    {theirSwap?.skill_offerings?.title || 'Not specified'}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-medium'>Upcoming Sessions</h3>

            {mySwap?.scheduled_times && mySwap.scheduled_times.length > 0 ? (
              <div className='space-y-2'>
                <h4 className='text-muted-foreground text-sm font-medium'>
                  You teaching:
                </h4>
                <ul className='space-y-2'>
                  {mySwap.scheduled_times.map((time: string, index: number) => (
                    <li
                      key={`my-${index}`}
                      className='flex items-center rounded-md border p-2'
                    >
                      <Calendar className='text-primary mr-2 h-4 w-4' />
                      <span>
                        {format(new Date(time), 'PPP')} at{' '}
                        {format(new Date(time), 'p')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No teaching sessions scheduled yet.
              </p>
            )}

            {theirSwap?.scheduled_times &&
            theirSwap.scheduled_times.length > 0 ? (
              <div className='space-y-2'>
                <h4 className='text-muted-foreground text-sm font-medium'>
                  You learning:
                </h4>
                <ul className='space-y-2'>
                  {theirSwap.scheduled_times.map(
                    (time: string, index: number) => (
                      <li
                        key={`their-${index}`}
                        className='flex items-center rounded-md border p-2'
                      >
                        <Calendar className='text-primary mr-2 h-4 w-4' />
                        <span>
                          {format(new Date(time), 'PPP')} at{' '}
                          {format(new Date(time), 'p')}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No learning sessions scheduled yet.
              </p>
            )}
          </div>

          <ExchangeActions
            exchange={exchange}
            currentUserId={currentUserId}
            otherUser={otherUser}
          />
        </CardContent>
      </Card>
    </div>
  )
}
