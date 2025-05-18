import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const StatsCardsSkeleton = () => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-5 w-1/2' />
              <Skeleton className='h-4 w-4 rounded-full' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-8 w-1/4' />
              <Skeleton className='h-4 w-3/4' />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
