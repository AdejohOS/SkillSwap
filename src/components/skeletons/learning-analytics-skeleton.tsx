import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface LearningAnalyticsSkeletonProps {
  compact?: boolean
}

export const LearningAnalyticsSkeleton = ({
  compact = false
}: LearningAnalyticsSkeletonProps) => {
  return (
    <div className={compact ? 'h-full' : 'space-y-4'}>
      <Card className={compact ? 'h-full' : ''}>
        <CardHeader>
          <CardTitle>Learning Analytics</CardTitle>
          <CardDescription>
            Insights about your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {!compact && (
            <>
              <div>
                <h3 className='mb-2 text-lg font-medium'>
                  Learning Requests Status
                </h3>
                <Skeleton className='h-[300px] w-full' />
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='mb-2 text-lg font-medium'>
                    Learning Progress
                  </h3>
                  <Skeleton className='h-[300px] w-full' />
                </div>

                <div>
                  <h3 className='mb-2 text-lg font-medium'>Learning Hours</h3>
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
