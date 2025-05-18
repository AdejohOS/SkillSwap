import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { EngagementAnalyticsContent } from './engagement-analytics-content'

interface ActivityData {
  period: string
  logins: number
  messages: number
  swaps: number
}

interface ResponseData {
  period: string
  hours: number
}

interface RatingData {
  rating: number
  count: number
}

interface EngagementAnalyticsData {
  activity_data: ActivityData[]
  response_data: ResponseData[]
  rating_data: RatingData[]
}

interface EngagementAnalyticsProps {
  compact?: boolean
}

export async function EngagementAnalytics({
  compact = false
}: EngagementAnalyticsProps) {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Default data
  let engagementData: EngagementAnalyticsData = {
    activity_data: [],
    response_data: [],
    rating_data: []
  }

  // Only call RPC if user exists
  if (user) {
    const { data } = (await supabase.rpc('get_engagement_analytics', {
      user_id: user.id
    })) as { data: EngagementAnalyticsData | null }

    if (data) {
      engagementData = data
    }
  }

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
          <EngagementAnalyticsContent
            activityData={engagementData.activity_data}
            responseData={engagementData.response_data}
            ratingData={engagementData.rating_data}
            compact={compact}
          />
        </CardContent>
      </Card>
    </div>
  )
}
