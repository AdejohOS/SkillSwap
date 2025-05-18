import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SkillsListSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className='flex flex-col'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-24' />
              </div>
              <Skeleton className='h-8 w-8 rounded-full' />
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3' />
              </div>
              <div className='mt-4 flex gap-2'>
                <Skeleton className='h-5 w-16 rounded-full' />
                <Skeleton className='h-5 w-20 rounded-full' />
              </div>
            </CardContent>
            <CardFooter className='border-t pt-4'>
              <Skeleton className='h-10 w-full' />
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
