import Link from 'next/link'
import { BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const LearningRequestsEmptyState = () => {
  return (
    <div className='animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center'>
      <div className='bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
        <BookOpen className='text-muted-foreground h-10 w-10' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No learning requests found</h3>
      <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
        You haven&apos;t added any learning requests yet. Add a request to find
        someone who can teach you.
      </p>
      <Button asChild>
        <Link href='/dashboard/learning/new'>Add Your First Request</Link>
      </Button>
    </div>
  )
}
