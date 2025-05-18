import { ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface ExchangesEmptyStateProps {
  status?: 'active' | 'pending' | 'completed' | 'all'
}

export const ExchangesEmptyState = ({
  status = 'all'
}: ExchangesEmptyStateProps) => {
  let message = "You don't have any skill exchanges yet."

  if (status === 'active') {
    message = "You don't have any active exchanges."
  } else if (status === 'pending') {
    message = "You don't have any pending exchanges."
  } else if (status === 'completed') {
    message = "You don't have any completed exchanges."
  }

  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
      <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full'>
        <ArrowLeftRight className='text-muted-foreground h-10 w-10' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>{message}</h3>
      <p className='text-muted-foreground mt-2 mb-4 text-sm'>
        Find users with complementary skills and start exchanging knowledge.
      </p>
      <Button asChild>
        <Link href='/dashboard/exchanges/find'>Find Exchange Partners</Link>
      </Button>
    </div>
  )
}
