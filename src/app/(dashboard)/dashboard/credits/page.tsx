import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { ArrowDownCircle, ArrowUpCircle, Clock, Coins } from 'lucide-react'
import React, { Suspense } from 'react'
import { CreditTransactions } from './_components/credit-transactions'

const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your credits.</div>
  }

  // Fetch the user's credit balance from the credits table
  const { data: creditData, error: creditError } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  // If the user doesn't have a credit record yet, create one with the default balance (5)
  let balance = 0
  if (creditError && creditError.code === 'PGRST116') {
    const { data: newCredit, error: insertError } = await supabase
      .from('credits')
      .insert({ user_id: user.id, balance: 5 })
      .select('balance')
      .single()

    if (insertError) {
      console.error('Error creating credit record:', insertError)
    } else if (newCredit) {
      balance = newCredit.balance
    }
  } else if (creditError) {
    console.error('Error fetching credit balance:', creditError)
  } else {
    balance = creditData?.balance || 0
  }

  // Fetch credit statistics
  const { data: earnedTotal } = await supabase
    .from('credit_transactions')
    .select('amount')
    .eq('user_id', user.id)
    .gt('amount', 0)
    .limit(1000)

  const { data: spentTotal } = await supabase
    .from('credit_transactions')
    .select('amount')
    .eq('user_id', user.id)
    .lt('amount', 0)
    .limit(1000)

  // Calculate totals
  const totalEarned = earnedTotal?.reduce((sum, tx) => sum + tx.amount, 0) || 0
  const totalSpent =
    spentTotal?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Credits</h2>
        <p className='text-muted-foreground'>
          Earn credits by teaching skills and spend them to learn from others.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Current Balance
            </CardTitle>
            <Coins className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{balance}</div>
            <p className='text-muted-foreground text-xs'>
              Available to spend on learning new skills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Earned</CardTitle>
            <ArrowUpCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalEarned}</div>
            <p className='text-muted-foreground text-xs'>
              Credits earned from teaching and other activities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Spent</CardTitle>
            <ArrowDownCircle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalSpent}</div>
            <p className='text-muted-foreground text-xs'>
              Credits spent on learning skills
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-bold'>How to Earn Credits</h3>
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-2'>
                <div className='bg-primary/10 rounded-full p-2'>
                  <Coins className='text-primary h-6 w-6' />
                </div>
                <h4 className='font-semibold'>Teach a Skill</h4>
              </div>
              <p className='text-muted-foreground mt-2 text-sm'>
                Earn 5 credits for each completed teaching session.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-2'>
                <div className='bg-primary/10 rounded-full p-2'>
                  <Clock className='text-primary h-6 w-6' />
                </div>
                <h4 className='font-semibold'>Complete Learning</h4>
              </div>
              <p className='text-muted-foreground mt-2 text-sm'>
                Earn 1 credit for each completed learning session.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-2'>
                <div className='bg-primary/10 rounded-full p-2'>
                  <ArrowUpCircle className='text-primary h-6 w-6' />
                </div>
                <h4 className='font-semibold'>Special Events</h4>
              </div>
              <p className='text-muted-foreground mt-2 text-sm'>
                Participate in community events to earn bonus credits.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Suspense fallback={'Loading transactions...'}>
        <CreditTransactions userId={user.id} />
      </Suspense>
    </div>
  )
}

export default Page
