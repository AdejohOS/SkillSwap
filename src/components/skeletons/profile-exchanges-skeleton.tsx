import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const ProfileExchangesSkeleton = () => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-9 w-36' />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='mb-1 h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardContent>
                <div className='mb-2 flex gap-2'>
                  <Skeleton className='h-5 w-24' />
                  <Skeleton className='h-5 w-20' />
                </div>
                <Skeleton className='h-4 w-40' />
              </CardContent>
              <CardFooter>
                <div className='ml-auto'>
                  <Skeleton className='h-8 w-28' />
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}
