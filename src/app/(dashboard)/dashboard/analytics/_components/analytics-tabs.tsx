import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { TeachingAnalyticsSkeleton } from '@/components/skeletons/teaching-analytics-skeleton'
import { TeachingAnalytics } from './teaching-analytics'
import { LearningAnalyticsSkeleton } from '@/components/skeletons/learning-analytics-skeleton'
import { LearningAnalytics } from './learning-analytics'
import { EngagementAnalyticsSkeleton } from '@/components/skeletons/engagement-analytics-skeleton'
import { EngagementAnalytics } from './engagement-analytics'

export const AnalyticsTabs = () => {
  return (
    <Tabs defaultValue='teaching' className='space-y-4'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='teaching'>Teaching</TabsTrigger>
        <TabsTrigger value='learning'>Learning</TabsTrigger>
        <TabsTrigger value='engagement'>Engagement</TabsTrigger>
      </TabsList>

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
