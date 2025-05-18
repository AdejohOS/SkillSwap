import { AnalyticsHeaderSkeleton } from '@/components/skeletons/analytics-header-skeleton'
import { AnalyticsOverviewSkeleton } from '@/components/skeletons/analytics-overview-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AnalyticsLoading() {
  return (
    <div className='space-y-6'>
      <AnalyticsHeaderSkeleton />

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='teaching'>Teaching</TabsTrigger>
          <TabsTrigger value='learning'>Learning</TabsTrigger>
          <TabsTrigger value='engagement'>Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <AnalyticsOverviewSkeleton />
        </TabsContent>
      </Tabs>
    </div>
  )
}
