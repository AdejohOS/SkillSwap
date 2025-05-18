import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SwapsListSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className='flex flex-col'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0'>
              <div className='flex items-start space-x-4'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='mt-1 h-4 w-24' />
                </div>
              </div>
              <Skeleton className='h-5 w-16 rounded-full' />
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-full' />
                </div>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between border-t pt-4'>
              <Skeleton className='h-10 w-28' />
              <Skeleton className='h-10 w-36' />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
