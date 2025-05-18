import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ProfileHeaderSkeleton = () => {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <Skeleton className='h-24 w-24 rounded-full' />

          <div className='flex-1 space-y-4'>
            <div>
              <Skeleton className='h-8 w-48' />
              <div className='mt-2 flex items-center gap-2'>
                <Skeleton className='h-4 w-24' />
              </div>
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>

            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-20 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
            </div>

            <div className='flex flex-wrap gap-6 pt-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-6 w-40' />
            </div>

            <div className='grid grid-cols-3 gap-4 pt-2'>
              <Skeleton className='h-20 rounded-lg' />
              <Skeleton className='h-20 rounded-lg' />
              <Skeleton className='h-20 rounded-lg' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
