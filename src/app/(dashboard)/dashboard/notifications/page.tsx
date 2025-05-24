import { createClient } from '@/utils/supabase/server'

import { NotificationsContent } from './_components/notifications-content'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your notifications.</div>
  }
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Notifications</h2>
        <p className='text-muted-foreground'>
          Stay updated with your skill swap activities.
        </p>
      </div>

      <NotificationsContent userId={user.id} />
    </div>
  )
}

export default Page
