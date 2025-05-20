import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/server'

import { notFound, redirect } from 'next/navigation'
import React from 'react'
import { ExchangeMessages } from '../_components/exchange-messages'
import { ExchangeScheduler } from '../_components/exchange-scheduler'
import { ExchangeDetail } from '../_components/exchange-detail'

export const dynamic = 'force-dynamic'

const Page = async ({
  params
}: {
  params: Promise<{ exchangesId: string }>
}) => {
  const { exchangesId } = await params
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch the exchange
  const { data: exchange, error } = await supabase
    .from('exchanges')
    .select(
      `
      *,
      user1:profiles!exchanges_user1_id_fkey(id, username, avatar_url),
      user2:profiles!exchanges_user2_id_fkey(id, username, avatar_url),
      swap1:swaps!exchanges_swap1_id_fkey(
        id, 
        status, 
        scheduled_times,
        teacher_id,
        learner_id,
        skill_offerings(id, title, description, user_id)
      ),
      swap2:swaps!exchanges_swap2_id_fkey(
        id, 
        status, 
        scheduled_times,
        teacher_id,
        learner_id,
        skill_offerings(id, title, description, user_id)
      )
    `
    )
    .eq('id', exchangesId)
    .single()

  if (error || !exchange) {
    console.error('Error fetching exchange:', error)
    notFound()
  }

  // Check if the current user is part of this exchange
  const currentUserId = user.id
  if (
    exchange.user1_id !== currentUserId &&
    exchange.user2_id !== currentUserId
  ) {
    // User doesn't have access to this exchange
    redirect('/dashboard/exchanges')
  }

  // Determine the other user
  const isUser1 = exchange.user1_id === currentUserId
  const otherUser = isUser1 ? exchange.user2 : exchange.user1

  const isPending = exchange.status === 'pending'
  const isRecipient = exchange.created_by !== currentUserId
  const needsApproval = isPending && isRecipient

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          {needsApproval ? 'Exchange Request' : 'Exchange Details'}
        </h1>
        <p className='text-muted-foreground'>
          {needsApproval
            ? `Review and respond to ${otherUser.username}'s exchange request`
            : `View and manage your skill exchange with ${otherUser.username}`}
        </p>
      </div>

      <Separator />

      <ExchangeDetail
        exchange={exchange}
        currentUserId={currentUserId}
        otherUser={otherUser}
      />

      {exchange.status === 'accepted' || exchange.status === 'in_progress' ? (
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='teaching'>Teaching</TabsTrigger>
            <TabsTrigger value='learning'>Learning</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            {/* Overview content is already shown in ExchangeDetail */}
          </TabsContent>

          <TabsContent value='teaching' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Teaching Session</CardTitle>
                <CardDescription>
                  You are teaching {otherUser.username} the skill "
                  {isUser1
                    ? exchange.swap1?.skill_offerings?.title
                    : exchange.swap2?.skill_offerings?.title}
                  "
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Teaching specific content */}
                  {isUser1 && exchange.swap1_id ? (
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={exchange.swap1_id}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
                  ) : !isUser1 && exchange.swap2_id ? (
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={exchange.swap2_id}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className='flex h-[400px] flex-col'>
              <CardHeader>
                <CardTitle>Teaching Messages</CardTitle>
                <CardDescription>
                  Communicate with {otherUser.username} about your teaching
                  session
                </CardDescription>
              </CardHeader>
              <ExchangeMessages
                exchangeId={exchangesId}
                otherUser={otherUser}
              />
            </Card>
          </TabsContent>

          <TabsContent value='learning' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Learning Session</CardTitle>
                <CardDescription>
                  {otherUser.username} is teaching you the skill "
                  {isUser1
                    ? exchange.swap2?.skill_offerings?.title
                    : exchange.swap1?.skill_offerings?.title}
                  "
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Learning specific content */}
                  {isUser1 && exchange.swap2_id ? (
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={exchange.swap2_id}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
                  ) : !isUser1 && exchange.swap1_id ? (
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={exchange.swap1_id}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className='flex h-[400px] flex-col'>
              <CardHeader>
                <CardTitle>Learning Messages</CardTitle>
                <CardDescription>
                  Communicate with {otherUser.username} about your learning
                  session
                </CardDescription>
              </CardHeader>
              <ExchangeMessages
                exchangeId={exchangesId}
                otherUser={otherUser}
              />
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}

export default Page
