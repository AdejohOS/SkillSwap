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

import { ExchangeMessages } from '../_components/exchange-messages'
import { ExchangeScheduler } from '../_components/exchange-scheduler'
import { ExchangeDetail } from '../_components/exchange-detail'
import { Metadata } from 'next'

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

export const metadata: Metadata = {
  title: 'Exchange Details',
  description: 'View and manage your skill exchange'
}

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

  let myTeachingSwap: Swap | null = null
  let myLearningSwap: Swap | null = null
  let teachingSwapId: string | null = null
  let learningSwapId: string | null = null

  if (exchange.is_credit_based) {
    // For credit-based exchanges, there's only one swap
    const activeSwap = exchange.swap1
    if (activeSwap?.teacher_id === currentUserId) {
      myTeachingSwap = activeSwap
      teachingSwapId = exchange.swap1_id
    } else if (activeSwap?.learner_id === currentUserId) {
      myLearningSwap = activeSwap
      learningSwapId = exchange.swap1_id
    }
  } else {
    // For reciprocal exchanges, determine which swap is which based on teacher_id
    if (exchange.swap1?.teacher_id === currentUserId) {
      myTeachingSwap = exchange.swap1
      teachingSwapId = exchange.swap1_id
      myLearningSwap = exchange.swap2
      learningSwapId = exchange.swap2_id
    } else if (exchange.swap2?.teacher_id === currentUserId) {
      myTeachingSwap = exchange.swap2
      teachingSwapId = exchange.swap2_id
      myLearningSwap = exchange.swap1
      learningSwapId = exchange.swap1_id
    }
  }

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
            {myTeachingSwap && (
              <TabsTrigger value='teaching'>Teaching</TabsTrigger>
            )}
            {myLearningSwap && (
              <TabsTrigger value='learning'>Learning</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            {/* Overview content is already shown in ExchangeDetail */}
          </TabsContent>

          {myTeachingSwap && teachingSwapId && (
            <TabsContent value='teaching' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Session</CardTitle>
                  <CardDescription>
                    You are teaching {otherUser.username} the skill "
                    {myTeachingSwap.skill_offerings?.title || 'Unknown Skill'}"
                    {exchange.is_credit_based && (
                      <span className='ml-2 font-medium text-amber-600'>
                        (Credit-based - You'll earn{' '}
                        {exchange.credit_amount || 5} credits)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={teachingSwapId}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
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
          )}

          {myLearningSwap && learningSwapId && (
            <TabsContent value='learning' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Session</CardTitle>
                  <CardDescription>
                    {otherUser.username} is teaching you the skill "
                    {myLearningSwap.skill_offerings?.title || 'Unknown Skill'}"
                    {exchange.is_credit_based && (
                      <span className='ml-2 font-medium text-amber-600'>
                        (Credit-based - You spent {exchange.credit_amount || 5}{' '}
                        credits)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <ExchangeScheduler
                      exchange={exchange}
                      swapId={learningSwapId}
                      disabled={
                        exchange.status !== 'accepted' &&
                        exchange.status !== 'in_progress'
                      }
                    />
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
          )}
        </Tabs>
      ) : null}
    </div>
  )
}

export default Page
