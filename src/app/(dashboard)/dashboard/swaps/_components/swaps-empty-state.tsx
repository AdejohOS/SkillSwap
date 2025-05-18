import Link from 'next/link'
import { Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface SwapsEmptyStateProps {
  status?: 'active' | 'pending' | 'completed' | 'all'
}

export const SwapsEmptyState = ({ status = 'all' }: SwapsEmptyStateProps) => {
  let message =
    "You don't have any swaps yet. Discover skills to start swapping."

  if (status === 'active') {
    message =
      "You don't have any active swaps. Accept pending swaps or discover new skills."
  } else if (status === 'pending') {
    message =
      "You don't have any pending swaps. Discover skills to request new swaps."
  } else if (status === 'completed') {
    message =
      "You don't have any completed swaps yet. Complete your active swaps to see them here."
  }

  return (
    <div className='animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center'>
      <div className='bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
        <Users className='text-muted-foreground h-10 w-10' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No swaps found</h3>
      <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
        {message}
      </p>
      <Button asChild>
        <Link href='/dashboard/discover'>Discover Skills</Link>
      </Button>
    </div>
  )
}
