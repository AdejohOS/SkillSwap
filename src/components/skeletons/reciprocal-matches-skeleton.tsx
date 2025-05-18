import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ReciprocalMatchesSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='flex flex-col'>
          <CardHeader className='flex flex-row items-start space-y-0'>
            <div className='flex items-start space-x-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div>
                <Skeleton className='mb-1 h-5 w-32' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex-1'>
            <div className='space-y-4'>
              <div>
                <Skeleton className='mb-1 h-4 w-24' />
                <Skeleton className='mb-1 h-4 w-full' />
                <Skeleton className='h-3 w-20' />
              </div>
              <div>
                <Skeleton className='mb-1 h-4 w-24' />
                <Skeleton className='mb-1 h-4 w-full' />
                <Skeleton className='h-3 w-20' />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4'>
            <Skeleton className='h-9 w-28' />
            <Skeleton className='h-9 w-32' />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
