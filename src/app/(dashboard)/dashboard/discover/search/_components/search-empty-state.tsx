import Link from 'next/link'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface SearchEmptyStateProps {
  searchParams: {
    query?: string
    category?: string
    experience?: string
    method?: string
    location?: string
    rating?: string
    available?: string
    reviews?: string
  }
}

export const SearchEmptyState = ({ searchParams }: SearchEmptyStateProps) => {
  // Determine if there are any filters applied
  const hasFilters = Object.values(searchParams).some(
    value => value !== undefined && value !== ''
  )

  return (
    <div className='animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center'>
      <div className='bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full'>
        <Search className='text-muted-foreground h-10 w-10' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No results found</h3>
      <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
        {hasFilters
          ? "We couldn't find any skills matching your search criteria. Try adjusting your filters or search for something else."
          : "Try searching for skills, topics, or keywords to find what you're looking for."}
      </p>
      <div className='flex gap-2'>
        {hasFilters && (
          <Button asChild variant='outline'>
            <Link href='/dashboard/discover/search'>Clear Filters</Link>
          </Button>
        )}
        <Button asChild>
          <Link href='/dashboard/discover'>Browse All Skills</Link>
        </Button>
      </div>
    </div>
  )
}
