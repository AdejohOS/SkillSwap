import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface RecentExchangesProps {
  userId: string
}

export const RecentExchanges = async ({ userId }: RecentExchangesProps) => {
  const supabase = await createClient()

  // Get recent exchanges
  const { data: exchanges, error } = await supabase
    .from('exchanges')
    .select(
      `
      id, 
      status, 
      created_at,
      user1_id,
      user2_id,
      swap1_id,
      swap2_id
    `
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent exchanges:', error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Exchanges</CardTitle>
          <CardDescription>Your most recent skill exchanges</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Error loading recent exchanges.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get all user IDs involved in exchanges
  const otherUserIds =
    exchanges?.map(exchange =>
      exchange.user1_id === userId ? exchange.user2_id : exchange.user1_id
    ) || []

  // Get all swap IDs involved in exchanges
  const swapIds =
    exchanges?.reduce((ids, exchange) => {
      if (exchange.swap1_id) ids.push(exchange.swap1_id)
      if (exchange.swap2_id) ids.push(exchange.swap2_id)
      return ids
    }, [] as string[]) || []

  // Get user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', otherUserIds)

  // Get swaps with their skill offerings
  const { data: swaps } = await supabase
    .from('swaps')
    .select(`id, skill_offerings!inner(id, title)`)
    .in('id', swapIds)

  const profileMap = (profiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, any>
  )

  const swapMap = (swaps || []).reduce(
    (map, swap) => {
      map[swap.id] = swap
      return map
    },
    {} as Record<string, any>
  )

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Recent Exchanges</CardTitle>
        <CardDescription>Your most recent skill exchanges</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {exchanges && exchanges.length > 0 ? (
          exchanges.map(exchange => {
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

            return (
              <div key={exchange.id} className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={
                      otherUser?.avatar_url ||
                      '/placeholder.svg?height=32&width=32'
                    }
                    alt={otherUser?.username}
                  />
                  <AvatarFallback>
                    {otherUser?.username?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center'>
                    <p className='text-sm leading-none font-medium'>
                      {otherUser?.username}
                    </p>
                    <Badge
                      variant={
                        exchange.status === 'pending'
                          ? 'outline'
                          : exchange.status === 'completed'
                            ? 'secondary'
                            : 'default'
                      }
                      className='ml-2'
                    >
                      {exchange.status.charAt(0).toUpperCase() +
                        exchange.status.slice(1)}
                    </Badge>
                  </div>
                  <div className='text-muted-foreground flex items-center text-xs'>
                    <span className='font-medium'>
                      {mySkill || 'Your skill'}
                    </span>
                    <ArrowLeftRight className='mx-1 h-3 w-3' />
                    <span className='font-medium'>
                      {theirSkill || 'Their skill'}
                    </span>
                  </div>
                </div>
                <Button variant='ghost' size='sm' asChild>
                  <Link href={`/dashboard/exchanges/${exchange.id}`}>View</Link>
                </Button>
              </div>
            )
          })
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <ArrowLeftRight className='text-muted-foreground mb-4 h-12 w-12' />
            <h3 className='text-lg font-medium'>No exchanges yet</h3>
            <p className='text-muted-foreground mb-4 text-sm'>
              Start exchanging skills with other users to see them here.
            </p>
            <Button asChild>
              <Link href='/dashboard/exchanges/find'>
                Find Exchange Partners
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      {exchanges && exchanges.length > 0 && (
        <CardFooter>
          <Button variant='outline' className='w-full' asChild>
            <Link href='/dashboard/exchanges'>View All Exchanges</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
