import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, Clock, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'

interface ProfileCreditsProps {
  userId: string
}

export const ProfileCredits = async ({ userId }: ProfileCreditsProps) => {
  const supabase = await createClient()

  // Fetch the user's credit balance
  const { data: creditData } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  // Fetch the user's recent credit transactions
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const balance = creditData?.balance || 0
  const earned =
    transactions
      ?.filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0
  const spent = Math.abs(
    transactions
      ?.filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0
  )

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className='text-3xl'>{balance} Credits</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button asChild className='w-full'>
              <Link href='/dashboard/credits'>
                <Plus className='mr-2 h-4 w-4' />
                Get More Credits
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Credits Earned</CardDescription>
            <CardTitle className='text-3xl text-green-600'>{earned}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              From teaching and completing exchanges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Credits Spent</CardDescription>
            <CardTitle className='text-3xl text-red-600'>{spent}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              On learning from other users
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className='mb-4 text-lg font-medium'>Recent Transactions</h3>

        {!transactions || transactions.length === 0 ? (
          <div className='rounded-lg border p-8 text-center'>
            <h3 className='font-medium'>No transactions yet</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Start earning and spending credits by exchanging skills.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {transactions.map(transaction => (
              <div
                key={transaction.id}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`rounded-full p-2 ${
                      transaction.amount > 0
                        ? 'bg-green-100 text-green-600'
                        : transaction.amount < 0
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className='h-5 w-5' />
                    ) : transaction.amount < 0 ? (
                      <ArrowDownRight className='h-5 w-5' />
                    ) : (
                      <Clock className='h-5 w-5' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium'>{transaction.description}</p>
                    <p className='text-muted-foreground text-sm'>
                      {transaction.created_at
                        ? new Date(transaction.created_at).toLocaleDateString()
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-medium ${
                    transaction.amount > 0
                      ? 'text-green-600'
                      : transaction.amount < 0
                        ? 'text-red-600'
                        : ''
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount} Credits
                </div>
              </div>
            ))}

            <Button variant='outline' className='w-full' asChild>
              <Link href='/dashboard/credits'>View All Transactions</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
