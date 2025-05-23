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
import { ReciprocalMatchesEmptyState } from './reciprocal-matches-empty-state'
import { InitiateExchangeButton } from './initiate-exchange-button'
import { createClient } from '@/utils/supabase/server'

interface ReciprocalMatchesProps {
  userId: string
}

export const ReciprocalMatches = async ({ userId }: ReciprocalMatchesProps) => {
  const supabase = await createClient()

  // Get reciprocal matches using the fixed function
  const { data: matches, error } = await supabase.rpc(
    'find_reciprocal_matches',
    {
      current_user_id: userId
    }
  )

  if (error) {
    console.error('Error finding reciprocal matches:', error)
    return (
      <div className='rounded-md bg-red-50 p-4 text-red-800'>
        Error finding potential exchange partners: {error.message}
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return <ReciprocalMatchesEmptyState />
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {matches.map(match => (
          <Card key={match.user2_id} className='flex flex-col'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0'>
              <div className='flex items-start space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={
                      match.user2_avatar_url ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={match.user2_name}
                  />
                  <AvatarFallback>
                    {match.user2_name?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-base'>
                    {match.user2_name}
                  </CardTitle>
                  <CardDescription>Potential Exchange Partner</CardDescription>
                </div>
              </div>
              <Badge variant='outline' className='flex items-center space-x-1'>
                <Star className='fill-primary text-primary h-3 w-3' />
                <span>{Math.round(match.match_score)}% Match</span>
              </Badge>
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='space-y-4'>
                <div>
                  <h4 className='text-sm font-semibold'>You can teach:</h4>
                  <p className='text-sm'>{match.i_can_teach_skill_title}</p>
                  <p className='text-muted-foreground text-xs'>
                    {match.i_can_teach_category}
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-semibold'>They can teach:</h4>
                  <p className='text-sm'>{match.they_can_teach_skill_title}</p>
                  <p className='text-muted-foreground text-xs'>
                    {match.they_can_teach_category}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between border-t pt-4'>
              <Button variant='outline' asChild>
                <Link href={`/dashboard/profile/${match.user2_id}`}>
                  View Profile
                </Link>
              </Button>
              <InitiateExchangeButton
                userId={userId}
                partnerId={match.user2_id}
                mySkillId={match.i_can_teach_skill_id}
                theirSkillId={match.they_can_teach_skill_id}
                otherUserName={match.user2_name}
                buttonText='Propose Exchange'
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
