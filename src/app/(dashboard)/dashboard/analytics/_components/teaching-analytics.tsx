import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { createClient } from '@/utils/supabase/server'
import { TeachingAnalyticsContent } from './teaching-analytics-content'

interface SkillData {
  skill_name: string
  requests: number
  swaps: number
}

interface CategoryData {
  category: string
  value: number
}

interface TimelineData {
  period: string
  hours: number
}

interface TeachingAnalyticsData {
  skills_data: SkillData[]
  category_data: CategoryData[]
  timeline_data: TimelineData[]
}

interface TeachingAnalyticsProps {
  compact?: boolean
}

export async function TeachingAnalytics({
  compact = false
}: TeachingAnalyticsProps) {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Default data
  let teachingData: TeachingAnalyticsData = {
    skills_data: [],
    category_data: [],
    timeline_data: []
  }

  // Only call RPC if user exists
  if (user) {
    const { data } = (await supabase.rpc('get_teaching_analytics', {
      user_id: user.id
    })) as { data: TeachingAnalyticsData | null }

    if (data) {
      teachingData = data
    }
  }

  return (
    <div className={compact ? 'h-full' : 'space-y-4'}>
      <Card className={compact ? 'h-full' : ''}>
        <CardHeader>
          <CardTitle>Teaching Analytics</CardTitle>
          <CardDescription>
            Insights about your teaching activities
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <TeachingAnalyticsContent
            skillsData={teachingData.skills_data}
            categoryData={teachingData.category_data}
            timelineData={teachingData.timeline_data}
            compact={compact}
          />
        </CardContent>
      </Card>
    </div>
  )
}
