import Link from 'next/link'
import { ArrowLeftRight, Clock } from 'lucide-react'

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
import { ExchangesEmptyState } from './exchanges-empty-state'
import { createClient } from '@/utils/supabase/server'

interface ExchangesListProps {
  userId: string
  status?: 'active' | 'pending' | 'completed' | 'all'
}

export const ExchangesList = async ({
  userId,
  status = 'all'
}: ExchangesListProps) => {
  const supabase = await createClient()

  // Query to get the user's exchanges
  let query = supabase
    .from('exchanges')
    .select(
      `
      id, 
      status, 
      created_at,
      updated_at,
      created_by,
      user1_id,
      user2_id,
      swap1_id,
      swap2_id
    `
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  // Filter by status if needed
  if (status === 'active') {
    query = query.in('status', ['accepted', 'in_progress'])
  } else if (status === 'pending') {
    query = query.eq('status', 'pending')
  } else if (status === 'completed') {
    query = query.eq('status', 'completed')
  }

  const { data: exchanges, error } = await query

  if (error) {
    console.error('Error fetching exchanges:', error)
    return (
      <div className='p-4'>
        Error loading exchanges. Please try again later.
      </div>
    )
  }

  if (!exchanges || exchanges.length === 0) {
    return <ExchangesEmptyState status={status} />
  }

  // Get all user IDs involved in exchanges
  const otherUserIds = exchanges.map(exchange =>
    exchange.user1_id === userId ? exchange.user2_id : exchange.user1_id
  )

  // Get all swap IDs involved in exchanges
  const swapIds = exchanges.reduce((ids, exchange) => {
    if (exchange.swap1_id) ids.push(exchange.swap1_id)
    if (exchange.swap2_id) ids.push(exchange.swap2_id)
    return ids
  }, [] as string[])

  // Get user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', otherUserIds)

  // Get swaps with their skill offerings
  const { data: swaps } = await supabase
    .from('swaps')
    .select(`id, status, skill_offerings!inner(id, title)`)
    .in('id', swapIds)

  const profileMap = (profiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, any>
  )

  const swapMap = (swaps || []).reduce(
    (map, swap: { id: string }) => {
      map[swap.id] = swap
      return map
    },
    {} as Record<string, any>
  )

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {exchanges.map(exchange => {
        const isUser1 = exchange.user1_id === userId
        const otherUserId = isUser1 ? exchange.user2_id : exchange.user1_id
        const otherUser = profileMap[otherUserId]

        // Determine which skills are being exchanged
        const mySwapId = isUser1 ? exchange.swap1_id : exchange.swap2_id
        const theirSwapId = isUser1 ? exchange.swap2_id : exchange.swap1_id

        const mySwap = mySwapId ? swapMap[mySwapId] : null
        const theirSwap = theirSwapId ? swapMap[theirSwapId] : null

        const mySkill = mySwap?.skill_offerings?.title
        const theirSkill = theirSwap?.skill_offerings?.title

        // Determine if the current user is the recipient of the exchange request
        const isRecipient = exchange.created_by !== userId
        const isPending = exchange.status === 'pending'

        return (
          <Card key={exchange.id} className='flex flex-col'>
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
                  <CardDescription>Skill Exchange Partner</CardDescription>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <Badge
                  variant={
                    exchange.status === 'pending'
                      ? 'outline'
                      : exchange.status === 'completed'
                        ? 'secondary'
                        : 'default'
                  }
                >
                  {exchange.status.charAt(0).toUpperCase() +
                    exchange.status.slice(1)}
                </Badge>
                {isPending && isRecipient && (
                  <Badge
                    variant='outline'
                    className='border-yellow-300 bg-yellow-50 text-yellow-700'
                  >
                    Needs Your Approval
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-sm font-semibold'>You teach:</h4>
                    <p className='text-sm'>{mySkill || 'Not specified'}</p>
                  </div>
                  <ArrowLeftRight className='text-muted-foreground mx-2 h-5 w-5' />
                  <div>
                    <h4 className='text-sm font-semibold'>They teach:</h4>
                    <p className='text-sm'>{theirSkill || 'Not specified'}</p>
                  </div>
                </div>

                <div className='text-muted-foreground flex items-center text-sm'>
                  <Clock className='mr-2 h-4 w-4' />
                  <span>
                    Created{' '}
                    {exchange.created_at
                      ? new Date(exchange.created_at).toLocaleDateString()
                      : 'Unknown date'}
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
                <Link href={`/dashboard/exchanges/${exchange.id}`}>
                  {isPending && isRecipient
                    ? 'Review Request'
                    : 'Manage Exchange'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
