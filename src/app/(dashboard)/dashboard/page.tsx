import React, { Suspense } from 'react'
import { StatsCards } from './_components/stats-cards'
import { StatsCardsSkeleton } from '@/components/skeletons/stats-card-skeleton'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RecentSwaps } from './_components/recent-swaps'
import { RecommendedMatches } from './_components/recomended-matches'

const page = () => {
  return (
    <div className='min-h-full space-y-8 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
        <p className='text-muted-foreground'>
          Welcome to SkillSwap, your peer learning marketplace.
        </p>
      </div>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>My Skills</CardTitle>
            <GraduationCap className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
            <p className='text-muted-foreground text-xs'>
              Skills you can teach others
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' className='w-full' asChild>
              <Link href='/dashboard/skills'>
                Manage Skills
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Learning Requests
            </CardTitle>
            <BookOpen className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2</div>
            <p className='text-muted-foreground text-xs'>
              Skills you want to learn
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' className='w-full' asChild>
              <Link href='/dashboard/learning'>
                Manage Requests
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Swaps</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1</div>
            <p className='text-muted-foreground text-xs'>
              Ongoing skill exchanges
            </p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' className='w-full' asChild>
              <Link href='/dashboard/swaps'>
                View Swaps
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Messages</CardTitle>
            <MessageSquare className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>5</div>
            <p className='text-muted-foreground text-xs'>Unread messages</p>
          </CardContent>
          <CardFooter>
            <Button variant='ghost' className='w-full' asChild>
              <Link href='/dashboard/messages'>
                View Messages
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Suspense
          fallback={
            <div className='bg-muted h-[400px] w-full animate-pulse rounded-lg' />
          }
        >
          <RecentSwaps />
        </Suspense>
        <Suspense
          fallback={
            <div className='bg-muted h-[400px] w-full animate-pulse rounded-lg' />
          }
        >
          <RecommendedMatches />
        </Suspense>
      </div>
    </div>
  )
}

export default page
