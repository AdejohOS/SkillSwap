import { ProfileHeaderSkeleton } from '@/components/skeletons/profile-header-skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/server'
import { Pencil } from 'lucide-react'
import Link from 'next/link'

import React, { Suspense } from 'react'

import { ProfileSkillsSkeleton } from '@/components/skeletons/profile-skill-skeleton'

import { ProfileReviewsSkeleton } from '@/components/skeletons/profile-review-skeleton'

import { ProfileHeader } from '../_components/profile-header'
import { ProfileSkills } from '../_components/profile-skills'
import { ProfileLearning } from '../_components/profile-learning'
import { ProfileLearningSkeleton } from '@/components/skeletons/profile-learning-skeleton'
import { ProfileExchanges } from '../_components/profile-exchanges'
import { ProfileExchangesSkeleton } from '@/components/skeletons/profile-exchanges-skeleton'
import { ProfileReviews } from '../_components/profile-reviews'
import { ProfileCreditsSkeleton } from '@/components/skeletons/profile-credits-skeleton'
import { ProfileCredits } from '../_components/profile-credits'

const Page = async () => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view profiles.</div>
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>My Profile</h2>
          <p className='text-muted-foreground'>
            View and manage your profile information.
          </p>
        </div>
        <Button asChild>
          <Link href='/dashboard/profile/edit'>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Profile
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader userId={user.id} />
      </Suspense>

      <Tabs defaultValue='skills' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='skills'>My Skills</TabsTrigger>
          <TabsTrigger value='learning'>Learning</TabsTrigger>
          <TabsTrigger value='exchanges'>Exchanges</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
          <TabsTrigger value='credits'>Credits</TabsTrigger>
        </TabsList>
        <TabsContent value='skills' className='space-y-4'>
          <Suspense fallback={<ProfileSkillsSkeleton />}>
            <ProfileSkills userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value='learning' className='space-y-4'>
          <Suspense fallback={<ProfileLearningSkeleton />}>
            <ProfileLearning userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value='exchanges' className='space-y-4'>
          <Suspense fallback={<ProfileExchangesSkeleton />}>
            <ProfileExchanges userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value='reviews' className='space-y-4'>
          <Suspense fallback={<ProfileReviewsSkeleton />}>
            <ProfileReviews userId={user.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value='credits' className='space-y-4'>
          <Suspense fallback={<ProfileCreditsSkeleton />}>
            <ProfileCredits userId={user.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
