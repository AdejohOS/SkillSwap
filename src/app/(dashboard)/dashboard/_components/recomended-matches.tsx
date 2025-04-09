import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

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

export function RecommendedMatches() {
  // In a real app, you would fetch this data from your API
  const matches = [
    {
      id: '1',
      user: {
        name: 'Morgan Lee',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'ML',
        rating: 4.8
      },
      theyTeach: 'French Language',
      theyWant: 'Web Development',
      matchScore: 95
    },
    {
      id: '2',
      user: {
        name: 'Taylor Kim',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'TK',
        rating: 4.6
      },
      theyTeach: 'Digital Marketing',
      theyWant: 'Graphic Design',
      matchScore: 87
    },
    {
      id: '3',
      user: {
        name: 'Jordan Rivera',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'JR',
        rating: 4.9
      },
      theyTeach: 'Piano Lessons',
      theyWant: 'Photography',
      matchScore: 82
    }
  ]

  return (
    <Card className='col-span-1'>
      <CardHeader>
        <CardTitle>Recommended Matches</CardTitle>
        <CardDescription>
          People who can teach what you want to learn
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {matches.map(match => (
          <div
            key={match.id}
            className='flex items-center justify-between space-x-4 rounded-md border p-4'
          >
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage src={match.user.avatar} alt={match.user.name} />
                <AvatarFallback>{match.user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className='flex items-center'>
                  <p className='text-sm leading-none font-medium'>
                    {match.user.name}
                  </p>
                  <div className='ml-2 flex items-center text-xs'>
                    <Star className='fill-primary text-primary mr-1 h-3 w-3' />
                    <span>{match.user.rating}</span>
                  </div>
                </div>
                <div className='text-muted-foreground mt-1 flex flex-col text-xs'>
                  <span>Can teach: {match.theyTeach}</span>
                  <span>Wants to learn: {match.theyWant}</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end gap-2'>
              <div className='text-xs font-medium'>
                <span className='text-primary'>{match.matchScore}%</span> match
              </div>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <ArrowRight className='h-4 w-4' />
                <span className='sr-only'>View profile</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant='outline' className='w-full' asChild>
          <Link href='/dashboard/discover'>Discover More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
