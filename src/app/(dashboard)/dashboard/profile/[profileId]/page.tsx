import { ProfileHeaderSkeleton } from '@/components/skeletons/profile-header-skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/server'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { RequestSwapButton } from '../_components/request-swap-button'
import { PublicProfileHeader } from '../_components/public-profile-header'
import { ProfileSkillsSkeleton } from '@/components/skeletons/profile-skill-skeleton'
import { PublicProfileSkills } from '../_components/public-profile-skills'
import { ProfileReviewsSkeleton } from '@/components/skeletons/profile-review-skeleton'
import { PublicProfileReviews } from '../_components/public-profile-reviews'

const Page = async ({ params }: { params: Promise<{ profileId: string }> }) => {
  const { profileId } = await params
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view profiles.</div>
  }

  const isOwnProfile = user.id === profileId

  if (isOwnProfile) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>My Profile</h2>
          <p className='text-muted-foreground'>This is your own profile.</p>
        </div>

        <div className='flex justify-center'>
          <Button asChild>
            <Link href='/dashboard/profile'>Go to My Profile</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', profileId)
    .single()

  if (error || !profile) {
    notFound()
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            {profile.username}'s Profile
          </h2>
          <p className='text-muted-foreground'>
            View {profile.username}'s skills and reviews.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' asChild>
            <Link href={`/dashboard/messages/${profileId}`}>
              <MessageSquare className='mr-2 h-4 w-4' />
              Message
            </Link>
          </Button>
          <RequestSwapButton userId={profileId} />
        </div>
      </div>

      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <PublicProfileHeader userId={profileId} />
      </Suspense>

      <Tabs defaultValue='skills' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='skills'>Skills</TabsTrigger>
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value='skills' className='space-y-4'>
          <Suspense fallback={<ProfileSkillsSkeleton />}>
            <PublicProfileSkills userId={profileId} />
          </Suspense>
        </TabsContent>
        <TabsContent value='reviews' className='space-y-4'>
          <Suspense fallback={<ProfileReviewsSkeleton />}>
            <PublicProfileReviews userId={profileId} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
