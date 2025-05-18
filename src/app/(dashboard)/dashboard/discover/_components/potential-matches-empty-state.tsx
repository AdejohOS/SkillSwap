import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface PotentialMatchesEmptyStateProps {
  message: string
}
export const PotentialMatchesEmptyState = ({
  message
}: PotentialMatchesEmptyStateProps) => {
  return (
    <div className='animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center'>
      <div className='bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
        <Search className='text-muted-foreground h-10 w-10' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No matches found</h3>
      <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
        {message}
      </p>
      <Button asChild>
        <Link href='/dashboard/learning/new'>Add Learning Request</Link>
      </Button>
    </div>
  )
}
