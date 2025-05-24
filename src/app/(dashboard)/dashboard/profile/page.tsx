import { ProfileHeaderSkeleton } from '@/components/skeletons/profile-header-skeleton'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { ProfileHeader } from './_components/profile-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSkillsSkeleton } from '@/components/skeletons/profile-skill-skeleton'
import { ProfileLearningSkeleton } from '@/components/skeletons/profile-learning-skeleton'
import { ProfileReviewsSkeleton } from '@/components/skeletons/profile-review-skeleton'
import { ProfileSkills } from './_components/profile-skills'
import { ProfileLearning } from './_components/profile-learning'
import { ProfileReviews } from './_components/profile-reviews'

export const dynamic = 'force-dynamic'

const ProfilePage = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your profile.</div>
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
          <TabsTrigger value='reviews'>Reviews</TabsTrigger>
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
        <TabsContent value='reviews' className='space-y-4'>
          <Suspense fallback={<ProfileReviewsSkeleton />}>
            <ProfileReviews userId={user.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage
