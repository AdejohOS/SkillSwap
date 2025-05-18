import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnalyticsOverviewSkeleton } from '@/components/skeletons/analytics-overview-skeleton'
import { TeachingAnalyticsSkeleton } from '@/components/skeletons/teaching-analytics-skeleton'
import { TeachingAnalytics } from './teaching-analytics'
import { LearningAnalyticsSkeleton } from '@/components/skeletons/learning-analytics-skeleton'
import { LearningAnalytics } from './learning-analytics'
import { EngagementAnalyticsSkeleton } from '@/components/skeletons/engagement-analytics-skeleton'
import { EngagementAnalytics } from './engagement-analytics'

export const AnalyticsTabs = () => {
  return (
    <Tabs defaultValue='overview' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='teaching'>Teaching</TabsTrigger>
        <TabsTrigger value='learning'>Learning</TabsTrigger>
        <TabsTrigger value='engagement'>Engagement</TabsTrigger>
      </TabsList>

      <TabsContent value='overview' className='space-y-4'>
        <Suspense fallback={<AnalyticsOverviewSkeleton />}>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Suspense fallback={<TeachingAnalyticsSkeleton />}>
              <TeachingAnalytics compact />
            </Suspense>
          </div>
        </Suspense>
      </TabsContent>

      <TabsContent value='teaching' className='space-y-4'>
        <Suspense fallback={<TeachingAnalyticsSkeleton />}>
          <TeachingAnalytics />
        </Suspense>
      </TabsContent>

      <TabsContent value='learning' className='space-y-4'>
        <Suspense fallback={<LearningAnalyticsSkeleton />}>
          <LearningAnalytics />
        </Suspense>
      </TabsContent>

      <TabsContent value='engagement' className='space-y-4'>
        <Suspense fallback={<EngagementAnalyticsSkeleton />}>
          <EngagementAnalytics />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
