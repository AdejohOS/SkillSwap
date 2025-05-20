import { Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface ProfileReviewsProps {
  userId: string
}

export const ProfileReviews = async ({ userId }: ProfileReviewsProps) => {
  const supabase = await createClient()

  // Fetch reviews where user was a teacher
  const { data: teacherSwaps } = await supabase
    .from('swaps')
    .select(
      `
      id,
      status,
      learner_id,
      teacher_rating,
      learner_feedback,
      completed_at,
      skill_offerings(title)
    `
    )
    .eq('teacher_id', userId)
    .eq('status', 'completed')
    .not('teacher_rating', 'is', null)
    .order('completed_at', { ascending: false })

  // Fetch reviews where user was a learner
  const { data: learnerSwaps } = await supabase
    .from('swaps')
    .select(
      `
      id,
      status,
      teacher_id,
      learner_rating,
      teacher_feedback,
      completed_at,
      skill_requests(title)
    `
    )
    .eq('learner_id', userId)
    .eq('status', 'completed')
    .not('learner_rating', 'is', null)
    .order('completed_at', { ascending: false })

  // Fetch profiles for the reviewers
  const reviewerIds = [
    ...(teacherSwaps?.map(swap => swap.learner_id) || []),
    ...(learnerSwaps?.map(swap => swap.teacher_id) || [])
  ]

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', reviewerIds)

  const profileMap = (profiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, any>
  )

  // Combine and format reviews
  const reviews = [
    ...(teacherSwaps?.map(swap => ({
      id: swap.id,
      reviewerId: swap.learner_id,
      rating: swap.teacher_rating,
      feedback: swap.learner_feedback,
      date: swap.completed_at,
      skillTitle: swap.skill_offerings?.title,
      type: 'teacher'
    })) || []),
    ...(learnerSwaps?.map(swap => ({
      id: swap.id,
      reviewerId: swap.teacher_id,
      rating: swap.learner_rating,
      feedback: swap.teacher_feedback,
      date: swap.completed_at,
      skillTitle: swap.skill_requests?.title,
      type: 'learner'
    })) || [])
  ].sort((a, b) =>
    new Date(a.date ?? 0).getTime() < new Date(b.date ?? 0).getTime() ? 1 : -1
  )

  if (reviews.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <h3 className='font-medium'>No reviews yet</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Complete skill swaps with other users to receive reviews.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {reviews.map(review => {
        const reviewer = profileMap[review.reviewerId]
        const formattedDate = review.date
          ? new Date(review.date).toLocaleDateString()
          : 'Unknown date'

        return (
          <Card key={review.id}>
            <CardHeader className='flex flex-row items-start space-y-0'>
              <div className='flex items-start space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={
                      reviewer?.avatar_url ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={reviewer?.username}
                  />
                  <AvatarFallback>
                    {reviewer?.username?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-base'>
                    {reviewer?.username}
                  </CardTitle>
                  <CardDescription>{formattedDate}</CardDescription>
                </div>
              </div>
              <div className='ml-auto flex items-center'>
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (review.rating ?? 0) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-2'>
                <Badge variant='outline'>
                  {review.type === 'teacher' ? 'As Teacher' : 'As Learner'}:{' '}
                  {review.skillTitle}
                </Badge>
              </div>
              <p className='text-sm'>
                {review.feedback || 'No written feedback provided.'}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
