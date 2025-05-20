import { Star, MapPin, Calendar, Globe } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface PublicProfileHeaderProps {
  userId: string
}

export const PublicProfileHeader = async ({
  userId
}: PublicProfileHeaderProps) => {
  const supabase = await createClient()

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!profile) {
    return <div>Error loading profile. Please try again later.</div>
  }

  // Fetch the user's skills count
  const { count: skillsCount } = await supabase
    .from('skill_offerings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true)

  // Fetch the user's completed swaps count
  const { count: swapsCount } = await supabase
    .from('swaps')
    .select('*', { count: 'exact', head: true })
    .or(`teacher_id.eq.${userId},learner_id.eq.${userId}`)
    .eq('status', 'completed')

  // Calculate average rating
  const { data: teacherRatings } = await supabase
    .from('swaps')
    .select('teacher_rating')
    .eq('teacher_id', userId)
    .not('teacher_rating', 'is', null)

  const { data: learnerRatings } = await supabase
    .from('swaps')
    .select('learner_rating')
    .eq('learner_id', userId)
    .not('learner_rating', 'is', null)

  const allRatings = [
    ...(teacherRatings?.map(r => r.teacher_rating) || []),
    ...(learnerRatings?.map(r => r.learner_rating) || [])
  ].filter(
    (rating): rating is number => typeof rating === 'number' && rating !== null
  )

  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((sum: number, rating: number) => sum + rating, 0) /
        allRatings.length
      : 0

  // Format the join date
  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : 'Unknown'

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <Avatar className='border-border h-24 w-24 border-2'>
            <AvatarImage
              src={profile.avatar_url || '/placeholder.svg?height=96&width=96'}
              alt={profile.username}
            />
            <AvatarFallback className='text-2xl'>
              {profile.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 space-y-4'>
            <div>
              <h3 className='text-2xl font-bold'>
                {profile.full_name || profile.username}
              </h3>
              <div className='text-muted-foreground flex flex-wrap items-center gap-2'>
                <span>@{profile.username}</span>
                {profile.location && (
                  <>
                    <span>•</span>
                    <MapPin className='h-4 w-4' />
                    <span>{profile.location}</span>
                  </>
                )}
                {profile.website && (
                  <>
                    <span>•</span>
                    <Globe className='h-4 w-4' />
                    <a
                      href={profile.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary hover:underline'
                    >
                      Website
                    </a>
                  </>
                )}
              </div>
            </div>

            {profile.bio && <p className='text-sm'>{profile.bio}</p>}

            <div className='flex flex-wrap gap-6 pt-2'>
              <div className='flex items-center gap-2'>
                <Star className='h-5 w-5 text-yellow-500' />
                <div>
                  <span className='font-medium'>
                    {averageRating.toFixed(1)}
                  </span>
                  <span className='text-muted-foreground text-sm'>
                    {' '}
                    ({allRatings.length} reviews)
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Calendar className='text-muted-foreground h-5 w-5' />
                <div>
                  <span className='text-muted-foreground text-sm'>
                    Joined {joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-2'>
              <div className='bg-muted rounded-lg p-3 text-center'>
                <div className='text-2xl font-bold'>{skillsCount || 0}</div>
                <div className='text-muted-foreground text-xs'>Skills</div>
              </div>
              <div className='bg-muted rounded-lg p-3 text-center'>
                <div className='text-2xl font-bold'>{swapsCount || 0}</div>
                <div className='text-muted-foreground text-xs'>
                  Completed Swaps
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
