import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

export function RecentSwaps() {
  // In a real app, you would fetch this data from your API
  const swaps = [
    {
      id: '1',
      partner: {
        name: 'Alex Johnson',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'AJ'
      },
      teaching: 'JavaScript Fundamentals',
      learning: 'Spanish Conversation',
      status: 'active',
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      partner: {
        name: 'Sam Taylor',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'ST'
      },
      teaching: 'Yoga for Beginners',
      learning: 'Digital Photography',
      status: 'pending',
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      partner: {
        name: 'Jamie Smith',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'JS'
      },
      teaching: 'Guitar Basics',
      learning: 'Cooking Italian Food',
      status: 'completed',
      lastActivity: '1 week ago'
    }
  ]

  return (
    <Card className='col-span-1'>
      <CardHeader>
        <CardTitle>Recent Swaps</CardTitle>
        <CardDescription>
          Your ongoing and recent skill exchanges
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {swaps.map(swap => (
          <div
            key={swap.id}
            className='flex items-center justify-between space-x-4 rounded-md border p-4'
          >
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage
                  src={swap.partner.avatar}
                  alt={swap.partner.name}
                />
                <AvatarFallback>{swap.partner.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm leading-none font-medium'>
                  {swap.partner.name}
                </p>
                <div className='text-muted-foreground mt-1 flex flex-col text-xs'>
                  <span>Teaching you: {swap.teaching}</span>
                  <span>Learning from you: {swap.learning}</span>
                  <span className='mt-1 text-xs'>{swap.lastActivity}</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end gap-2'>
              <Badge
                variant={
                  swap.status === 'active'
                    ? 'default'
                    : swap.status === 'pending'
                      ? 'outline'
                      : 'secondary'
                }
              >
                {swap.status}
              </Badge>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <ArrowRight className='h-4 w-4' />
                <span className='sr-only'>View details</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant='outline' className='w-full' asChild>
          <Link href='/dashboard/swaps'>View All Swaps</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
