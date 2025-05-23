import { cookies } from 'next/headers'
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
import { SearchEmptyState } from './search-empty-state'
import { createClient } from '@/utils/supabase/server'
import { SkillSwapButton } from '../../../swaps/_components/skill-swap-button'

interface Profile {
  id: string
  username: string
  avatar_url?: string | null
  location?: string | null
}

interface Category {
  id: string
  name: string
}

interface SearchResultsProps {
  searchParams: {
    query?: string
    category?: string
    experience?: string
    method?: string
    location?: string
    rating?: string
    available?: string
    reviews?: string
  }
  userId: string
}

export const SearchResults = async ({
  searchParams,
  userId
}: SearchResultsProps) => {
  const supabase = await createClient()

  // Call the search_skills function
  const { data: skills, error } = await supabase.rpc('search_skills', {
    search_query: searchParams.query || undefined,
    filter_category_id: searchParams.category || undefined,
    filter_experience_level: searchParams.experience || undefined,
    filter_teaching_method: searchParams.method || undefined,
    filter_location: searchParams.location || undefined,
    min_rating: searchParams.rating ? Number.parseInt(searchParams.rating) : 0,
    filter_available_now: searchParams.available === 'true',
    filter_has_reviews: searchParams.reviews === 'true',
    current_user_id: userId
  })

  if (error) {
    console.error('Error searching skills:', error)
    return <div>Error loading search results. Please try again later.</div>
  }

  if (!skills || skills.length === 0) {
    return <SearchEmptyState searchParams={searchParams} />
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

  // Get categories for the skills
  const categoryIds = Array.from(
    new Set(skills.map(skill => skill.category_id))
  )
  const { data: categories } = await supabase
    .from('skill_categories')
    .select('id, name')
    .in('id', categoryIds)

  const categoryMap = (categories || []).reduce(
    (map, category) => {
      map[category.id] = category
      return map
    },
    {} as Record<string, Category>
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
        Found {skills.length} result{skills.length !== 1 ? 's' : ''}
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {skills.map(skill => {
          const teacherProfile = teacherProfileMap[skill.user_id]
          const category = categoryMap[skill.category_id]
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
                      {category?.name}
                      {teacherProfile?.location &&
                        ` • ${teacherProfile.location}`}
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
                  {skill.available_now && (
                    <Badge variant='default' className='bg-green-500'>
                      Available Now
                    </Badge>
                  )}
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
