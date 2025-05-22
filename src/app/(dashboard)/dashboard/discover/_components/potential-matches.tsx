import { createClient } from '@/utils/supabase/server'
import { PotentialMatchesEmptyState } from './potential-matches-empty-state'
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
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { InitiateSwapButton } from './initiate-swap-button'

interface Match {
  offering_id: string
  teacher_id: string
  teacher_name: string
  category_name: string
  skill_title: string
  match_score: number
}

interface Request {
  id: string
  title: string
  category_id: string
}

interface MatchResult {
  request: Request
  matches: Match[]
}
interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

export const PotentialMatches = async () => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view potential matches.</div>
  }

  const { data: requests } = await supabase
    .from('skill_requests')
    .select('id, title, category_id')
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (!requests || requests.length === 0) {
    return (
      <PotentialMatchesEmptyState message="You don't have any active learning requests. Add a learning request to find potential matches." />
    )
  }

  const matchPromises = requests.map(async request => {
    const { data: matches } = await supabase.rpc(
      'get_potential_matches_for_request',
      {
        request_uuid: request.id
      }
    )
    return { request, matches: matches || [] }
  })

  const matchResults = await Promise.all(matchPromises)
  const hasMatches = matchResults.some(result => result.matches.length > 0)

  if (!hasMatches) {
    return (
      <PotentialMatchesEmptyState message='No potential matches found for your learning requests. Try browsing all available skills instead.' />
    )
  }

  const teacherIds: Set<string> = new Set(
    matchResults.flatMap(
      (result: MatchResult) =>
        result.matches?.map((match: Match) => match.teacher_id) || []
    )
  )

  const { data: teacherProfiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', Array.from(teacherIds))

  const teacherProfileMap = (teacherProfiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, Profile>
  )

  return (
    <div className='space-y-6'>
      {matchResults.map(
        result =>
          result.matches &&
          result.matches.length > 0 && (
            <div key={result.request.id} className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold'>
                  Matches for: {result.request.title}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  These users can teach you the skills you want to learn.
                </p>
              </div>

              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {result.matches.map((match: Match) => {
                  const teacherProfile: Profile | undefined =
                    teacherProfileMap[match.teacher_id]
                  return (
                    <Card key={match.offering_id} className='flex flex-col'>
                      <CardHeader className='flex flex-row items-start justify-between space-y-0'>
                        <div className='flex items-start space-x-4'>
                          <Avatar>
                            <AvatarImage
                              src={
                                teacherProfile?.avatar_url ||
                                '/placeholder.svg?height=40&width=40'
                              }
                              alt={match.teacher_name}
                            />
                            <AvatarFallback>
                              {match.teacher_name
                                ?.substring(0, 2)
                                .toUpperCase() || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className='text-base'>
                              {match.teacher_name}
                            </CardTitle>
                            <CardDescription>
                              {match.category_name}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant='outline'
                          className='flex items-center space-x-1'
                        >
                          <Star className='fill-primary text-primary h-3 w-3' />
                          <span>{Math.round(match.match_score)}%</span>
                        </Badge>
                      </CardHeader>
                      <CardContent className='flex-1'>
                        <h4 className='font-medium'>{match.skill_title}</h4>
                        <p className='text-muted-foreground mt-2 line-clamp-3 text-sm'>
                          This skill matches your request for{' '}
                          {result.request.title}.
                        </p>
                      </CardContent>
                      <CardFooter className='flex justify-between border-t pt-4'>
                        <Button variant='outline' asChild>
                          <Link href={`/dashboard/profile/${match.teacher_id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <InitiateSwapButton
                          offeringId={match.offering_id}
                          requestId={result.request.id}
                          teacherId={match.teacher_id}
                          learnerId={user.id}
                        />
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
      )}
    </div>
  )
}
