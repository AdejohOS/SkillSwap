import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ProfileLearningSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className='flex flex-col'>
            <CardHeader>
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='mt-1 h-4 w-1/2' />
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3' />
              </div>
              <div className='mt-4 flex gap-2'>
                <Skeleton className='h-5 w-16 rounded-full' />
                <Skeleton className='h-5 w-24 rounded-full' />
              </div>
            </CardContent>
            <CardFooter className='border-t pt-4'>
              <Skeleton className='ml-auto h-8 w-28' />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
