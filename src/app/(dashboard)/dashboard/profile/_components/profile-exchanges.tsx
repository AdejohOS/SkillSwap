import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface ProfileExchangesProps {
  userId: string
}

interface Exchange {
  id: string
  status: string
  created_at: string
  user1_id: string
  user2_id: string
  swap1_id: string
  swap2_id: string
  is_credit_based: boolean
  credit_amount: number
  created_by: string
  swap1: {
    id: string
    teacher_id: string
    learner_id: string
    skill_offering_id: string
    skill_request_id: string
  }
  swap2: {
    id: string
    teacher_id: string
    learner_id: string
    skill_offering_id: string
    skill_request_id: string
  }
  user1: {
    username: string
  }
  user2: {
    username: string
  }
}

export const ProfileExchanges = async ({ userId }: ProfileExchangesProps) => {
  const supabase = await createClient()

  const { data: exchanges } = (await supabase
    .from('exchanges')
    .select(
      `
      id,
      status,
      created_at,
      user1_id,
      user2_id,
      swap1_id,
      swap2_id,
      is_credit_based,
      credit_amount,
      created_by,
      swap1:swaps!swap1_id(
        id,
        teacher_id,
        learner_id,
        skill_offering_id,
        skill_request_id
      ),
      swap2:swaps!swap2_id(
        id,
        teacher_id,
        learner_id,
        skill_offering_id,
        skill_request_id
      ),
      user1:profiles!user1_id(username),
      user2:profiles!user2_id(username)
    `
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(10)) as unknown as { data: Exchange[] }

  if (!exchanges || exchanges.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <h3 className='font-medium'>No exchanges yet</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Start exchanging skills with other users.
        </p>
        <Button className='mt-4' asChild>
          <Link href='/dashboard/exchanges/find'>Find Exchange Partners</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Recent Exchanges</h3>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard/exchanges'>View All Exchanges</Link>
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {exchanges.map(exchange => {
          const isUser1 = exchange.user1_id === userId
          const otherUser = isUser1
            ? exchange.user2.username
            : exchange.user1.username

          const userSwap = isUser1 ? exchange.swap1 : exchange.swap2
          const isTeacher = userSwap?.teacher_id === userId
          const skillTitle = isTeacher ? 'Teaching skill' : 'Learning skill'

          let statusBadge
          switch (exchange.status) {
            case 'pending':
              statusBadge = (
                <Badge variant='outline' className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  Pending Approval
                </Badge>
              )
              break
            case 'accepted':
              statusBadge = (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  <CheckCircle className='h-3 w-3' />
                  Active
                </Badge>
              )
              break
            case 'completed':
              statusBadge = (
                <Badge variant='default' className='flex items-center gap-1'>
                  <CheckCircle className='h-3 w-3' />
                  Completed
                </Badge>
              )
              break
            case 'rejected':
              statusBadge = (
                <Badge
                  variant='destructive'
                  className='flex items-center gap-1'
                >
                  <XCircle className='h-3 w-3' />
                  Rejected
                </Badge>
              )
              break
            default:
              statusBadge = <Badge variant='outline'>{exchange.status}</Badge>
          }

          return (
            <Card key={exchange.id}>
              <CardHeader>
                <CardTitle className='text-base'>{skillTitle}</CardTitle>
                <CardDescription>
                  {isTeacher ? 'Teaching to' : 'Learning from'} {otherUser}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-2 flex flex-wrap gap-2'>
                  {statusBadge}
                  {exchange.is_credit_based && (
                    <Badge variant='secondary'>
                      {exchange.credit_amount} Credits
                    </Badge>
                  )}
                  <Badge variant={isTeacher ? 'outline' : 'secondary'}>
                    {isTeacher ? 'Teacher' : 'Learner'}
                  </Badge>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Created on{' '}
                  {new Date(exchange.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant='ghost'
                  size='sm'
                  className='ml-auto gap-1'
                  asChild
                >
                  <Link href={`/dashboard/exchanges/${exchange.id}`}>
                    View Details
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
