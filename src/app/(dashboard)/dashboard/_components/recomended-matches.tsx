import Link from 'next/link'
import { Star } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

type Match = {
  user2_id: string
  user2_avatar_url?: string | null
  user2_name: string
  match_score: number
  i_can_teach_skill_title: string
  they_can_teach_skill_title: string
}
interface RecommendedMatchesProps {
  userId: string
}

export const RecommendedMatches = async ({
  userId
}: RecommendedMatchesProps) => {
  const supabase = await createClient()

  // Get reciprocal matches
  const { data: matches, error } = await supabase
    .rpc('find_reciprocal_matches', {
      current_user_id: userId
    })
    .limit(3)

  if (error) {
    console.error('Error finding recommended matches:', error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Matches</CardTitle>
          <CardDescription>Users with complementary skills</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>
            Error loading recommended matches.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Recommended Matches</CardTitle>
        <CardDescription>Users with complementary skills</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {matches && matches.length > 0 ? (
          matches.map((match: Match) => (
            <div key={match.user2_id} className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage
                  src={
                    match.user2_avatar_url ||
                    '/placeholder.svg?height=32&width=32'
                  }
                  alt={match.user2_name}
                />
                <AvatarFallback>
                  {match.user2_name?.substring(0, 2).toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center'>
                  <p className='text-sm leading-none font-medium'>
                    {match.user2_name}
                  </p>
                  <Badge
                    variant='outline'
                    className='ml-2 flex items-center space-x-1'
                  >
                    <Star className='fill-primary text-primary h-3 w-3' />
                    <span>{Math.round(match.match_score)}%</span>
                  </Badge>
                </div>
                <p className='text-muted-foreground text-xs'>
                  <span className='font-medium'>
                    {match.i_can_teach_skill_title}
                  </span>{' '}
                  ↔{' '}
                  <span className='font-medium'>
                    {match.they_can_teach_skill_title}
                  </span>
                </p>
              </div>
              <Button variant='ghost' size='sm' asChild>
                <Link href={`/dashboard/profile/${match.user2_id}`}>View</Link>
              </Button>
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Star className='text-muted-foreground mb-4 h-12 w-12' />
            <h3 className='text-lg font-medium'>No matches found</h3>
            <p className='text-muted-foreground mb-4 text-sm'>
              Add more skills or learning requests to find potential matches.
            </p>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link href='/dashboard/skills/new'>Add Skill</Link>
              </Button>
              <Button size='sm' asChild>
                <Link href='/dashboard/learning/new'>Add Request</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {matches && matches.length > 0 && (
        <CardFooter>
          <Button variant='outline' className='w-full' asChild>
            <Link href='/dashboard/exchanges/find'>Find More Matches</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
