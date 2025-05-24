import Link from 'next/link'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { createClient } from '@/utils/supabase/client'
import { SearchEmptyState } from '../../search/_components/search-empty-state'
import { SkillSwapButton } from '../../search/_components/skill-swap-button'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
  location: string | null
}
interface CategorySkillsProps {
  categoryId: string
  userId: string
}

export async function CategorySkills({
  categoryId,
  userId
}: CategorySkillsProps) {
  const supabase = createClient()

  // Get skills in this category
  const { data: skills, error } = await supabase
    .from('skill_offerings')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching category skills:', error)
    return <div>Error loading skills. Please try again later.</div>
  }

  if (!skills || skills.length === 0) {
    return <SearchEmptyState searchParams={{ category: categoryId }} />
  }

  // Get user profiles for the skills
  const teacherIds = skills.map(skill => skill.user_id)
  const { data: teacherProfiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, location')
    .in('id', teacherIds)

  const teacherProfileMap = (teacherProfiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, Profile>
  )

  // Get average ratings for teachers
  const { data: ratings } = await supabase.rpc('get_user_average_ratings', {
    user_ids: teacherIds
  })

  const ratingsMap = (ratings || []).reduce(
    (map, item) => {
      map[item.user_id] = item.average_rating
      return map
    },
    {} as Record<string, number>
  )

  return (
    <div className='space-y-4'>
      <div className='text-muted-foreground text-sm'>
        Found {skills.length} skill{skills.length !== 1 ? 's' : ''} in this
        category
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {skills.map(skill => {
          const teacherProfile = teacherProfileMap[skill.user_id]
          const rating = ratingsMap[skill.user_id] || 0

          return (
            <Card key={skill.id} className='flex flex-col'>
              <CardHeader className='flex flex-row items-start justify-between space-y-0'>
                <div className='flex items-start space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={
                        teacherProfile?.avatar_url ||
                        '/placeholder.svg?height=40&width=40'
                      }
                      alt={teacherProfile?.username}
                    />
                    <AvatarFallback>
                      {teacherProfile?.username
                        ?.substring(0, 2)
                        .toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-base'>
                      {teacherProfile?.username}
                    </CardTitle>
                    <CardDescription>
                      {teacherProfile?.location && teacherProfile.location}
                    </CardDescription>
                  </div>
                </div>
                {rating > 0 && (
                  <div className='flex items-center'>
                    <Star className='mr-1 h-4 w-4 fill-yellow-500 text-yellow-500' />
                    <span className='text-sm font-medium'>
                      {rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent className='flex-1'>
                <h4 className='font-medium'>{skill.title}</h4>
                <p className='text-muted-foreground mt-2 line-clamp-3 text-sm'>
                  {skill.description}
                </p>
                <div className='mt-4 flex flex-wrap gap-2'>
                  <Badge variant='secondary'>{skill.experience_level}</Badge>
                  <Badge variant='outline'>
                    {skill.teaching_method === 'online'
                      ? 'Online Only'
                      : skill.teaching_method === 'in_person'
                        ? 'In-Person Only'
                        : 'Online & In-Person'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between border-t pt-4'>
                <Button variant='outline' asChild>
                  <Link href={`/dashboard/profile/${skill.user_id}`}>
                    View Profile
                  </Link>
                </Button>
                <SkillSwapButton skillId={skill.id} teacherId={skill.user_id} />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
