import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const ExchangesListSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className='flex flex-col'>
          <CardHeader className='flex flex-row items-start space-y-0'>
            <div className='flex items-start space-x-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='mt-1 h-4 w-24' />
              </div>
            </div>
            <Skeleton className='ml-auto h-6 w-20' />
          </CardHeader>
          <CardContent className='flex-1'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='mt-1 h-4 w-28' />
                </div>
                <Skeleton className='mx-2 h-5 w-5' />
                <div>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='mt-1 h-4 w-28' />
                </div>
              </div>
              <Skeleton className='h-4 w-40' />
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
