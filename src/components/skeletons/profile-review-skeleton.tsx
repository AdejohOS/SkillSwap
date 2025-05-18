import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ProfileReviewsSkeleton = () => {
  return (
    <div className='space-y-4'>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-start space-y-0'>
              <div className='flex items-start space-x-4'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='mt-1 h-4 w-24' />
                </div>
              </div>
              <div className='ml-auto flex items-center gap-1'>
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} className='h-4 w-4 rounded-full' />
                  ))}
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-6 w-32 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
