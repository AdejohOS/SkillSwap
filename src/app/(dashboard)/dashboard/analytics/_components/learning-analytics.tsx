import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { LearningAnalyticsContent } from './learning-analytics-content'

interface RequestsData {
  skill_name: string
  pending: number
  accepted: number
  completed: number
}

interface ProgressData {
  skill_name: string
  progress: number
}

interface TimelineData {
  period: string
  hours: number
}

interface LearningAnalyticsData {
  requests_data: RequestsData[]
  progress_data: ProgressData[]
  timeline_data: TimelineData[]
}

interface LearningAnalyticsProps {
  compact?: boolean
}

export const LearningAnalytics = async ({
  compact = false
}: LearningAnalyticsProps) => {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Default data
  let learningData: LearningAnalyticsData = {
    requests_data: [],
    progress_data: [],
    timeline_data: []
  }

  // Only call RPC if user exists
  if (user) {
    const { data } = (await supabase.rpc('get_learning_analytics', {
      user_id: user.id
    })) as { data: LearningAnalyticsData | null }

    if (data) {
      learningData = data
    }
  }

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
          <LearningAnalyticsContent
            requestsData={learningData.requests_data}
            progressData={learningData.progress_data}
            timelineData={learningData.timeline_data}
            compact={compact}
          />
        </CardContent>
      </Card>
    </div>
  )
}
