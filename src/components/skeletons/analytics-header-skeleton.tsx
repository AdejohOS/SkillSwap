import { CalendarRange, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const AnalyticsHeaderSkeleton = () => {
  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Analytics</h2>
          <p className='text-muted-foreground'>
            Track your teaching and learning activities on SkillSwap
          </p>
        </div>
        <Skeleton className='h-10 w-[250px]' />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='flex items-center gap-3'>
                  {i === 0 || i === 1 ? (
                    <Clock className='text-muted-foreground h-5 w-5' />
                  ) : i === 2 ? (
                    <Users className='text-muted-foreground h-5 w-5' />
                  ) : (
                    <CalendarRange className='text-muted-foreground h-5 w-5' />
                  )}
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-8 w-12' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
