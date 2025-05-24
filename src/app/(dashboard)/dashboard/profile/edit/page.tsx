import { createClient } from '@/utils/supabase/server'

import { ProfileForm } from '../_components/profile-form'

export const dynamic = 'force-dynamic'
const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to edit your profile.</div>
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Edit Profile</h2>
        <p className='text-muted-foreground'>
          Update your profile information and preferences.
        </p>
      </div>

      <ProfileForm profile={profile ?? undefined} />
    </div>
  )
}

export default Page
