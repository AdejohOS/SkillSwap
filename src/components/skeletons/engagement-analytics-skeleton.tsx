import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface EngagementAnalyticsSkeletonProps {
  compact?: boolean
}

export const EngagementAnalyticsSkeleton = ({
  compact = false
}: EngagementAnalyticsSkeletonProps) => {
  return (
    <div className={compact ? 'h-full' : 'space-y-4'}>
      <Card className={compact ? 'h-full' : ''}>
        <CardHeader>
          <CardTitle>Engagement Analytics</CardTitle>
          <CardDescription>
            Insights about your platform engagement
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {!compact && (
            <>
              <div>
                <h3 className='mb-2 text-lg font-medium'>Platform Activity</h3>
                <Skeleton className='h-[300px] w-full' />
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='mb-2 text-lg font-medium'>Response Time</h3>
                  <Skeleton className='h-[300px] w-full' />
                </div>

                <div>
                  <h3 className='mb-2 text-lg font-medium'>
                    Ratings Distribution
                  </h3>
                  <Skeleton className='h-[300px] w-full' />
                </div>
              </div>
            </>
          )}

          {compact && <Skeleton className='h-[200px] w-full' />}
        </CardContent>
      </Card>
    </div>
  )
}
