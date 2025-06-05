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
import { SkillSwapButton } from './skill-swap-button'

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

  // Build the query using direct table queries instead of RPC
  let query = supabase
    .from('skill_offerings')
    .select(
      `
      id,
      user_id,
      title,
      description,
      category_id,
      experience_level,
      teaching_method,
      available_now,
      profiles!inner(username, avatar_url, location),
      skill_categories(name)
    `
    )
    .eq('is_active', true)
    .neq('user_id', userId)

  // Apply search filters
  if (searchParams.query) {
    query = query.or(
      `title.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%`
    )
  }

  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category_id', searchParams.category)
  }

  if (searchParams.experience && searchParams.experience !== 'any') {
    query = query.eq('experience_level', searchParams.experience)
  }

  if (searchParams.method && searchParams.method !== 'any') {
    query = query.eq('teaching_method', searchParams.method)
  }

  if (searchParams.location && searchParams.location !== 'any') {
    query = query.ilike('profiles.location', `%${searchParams.location}%`)
  }

  if (searchParams.available === 'true') {
    query = query.eq('available_now', true)
  }

  const { data: skills, error } = await query.order('created_at', {
    ascending: false
  })

  if (error) {
    console.error('Error searching skills:', error)
    return (
      <div className='p-4'>
        Error loading search results. Please try again later.
      </div>
    )
  }

  if (!skills || skills.length === 0) {
    return <SearchEmptyState searchParams={searchParams} />
  }

  // Get ratings for the skills if rating filter is applied
  let ratingsMap: Record<string, number> = {}

  if (searchParams.rating && Number(searchParams.rating) > 0) {
    const reviewerIds = skills.map(skill => skill.user_id)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('reviewer_id, rating')
      .in('reviewer_id', reviewerIds)

    if (reviews) {
      const ratingsByReviewer = reviews.reduce(
        (acc, review) => {
          if (!acc[review.reviewer_id]) {
            acc[review.reviewer_id] = []
          }
          acc[review.reviewer_id].push(review.rating)
          return acc
        },
        {} as Record<string, number[]>
      )

      ratingsMap = Object.entries(ratingsByReviewer).reduce(
        (acc, [reviewerId, ratings]) => {
          acc[reviewerId] =
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          return acc
        },
        {} as Record<string, number>
      )

      // Filter by minimum rating if specified
      const minRating = Number(searchParams.rating)
      const filteredSkills = skills.filter(skill => {
        const rating = ratingsMap[skill.user_id] || 0
        return rating >= minRating
      })

      if (filteredSkills.length !== skills.length) {
        return <SearchEmptyState searchParams={searchParams} />
      }
    }
  }

  return (
    <div className='space-y-4'>
      <div className='text-muted-foreground text-sm'>
        Found {skills.length} result{skills.length !== 1 ? 's' : ''}
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {skills.map(skill => {
          const profile = Array.isArray(skill.profiles)
            ? skill.profiles[0]
            : skill.profiles
          const category = Array.isArray(skill.skill_categories)
            ? skill.skill_categories[0]
            : skill.skill_categories
          const rating = ratingsMap[skill.user_id] || 0

          return (
            <Card key={skill.id} className='flex flex-col'>
              <CardHeader className='flex flex-row items-start justify-between space-y-0'>
                <div className='flex items-start space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={
                        profile?.avatar_url ||
                        '/placeholder.svg?height=40&width=40'
                      }
                      alt={profile?.username}
                    />
                    <AvatarFallback>
                      {profile?.username?.substring(0, 2).toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-base'>
                      {profile?.username}
                    </CardTitle>
                    <CardDescription>
                      {category?.name}
                      {profile?.location && ` • ${profile.location}`}
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
