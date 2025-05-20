import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const SavedSearchesSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='mb-1 h-6 w-40' />
        <Skeleton className='h-4 w-60' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-lg border p-4'
              >
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-40' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='mt-1 h-4 w-48' />
                </div>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
