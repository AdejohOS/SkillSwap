import { UserMenu } from '@/components/user-menu'

import { MobileSidebar } from './mobile-sidebar'

import { NotificationBell } from '@/components/notifications/notification-bell'
import { createClient } from '@/utils/supabase/server'
import { SearchBar } from './search-bar'

export const DashboardNavbar = async () => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <nav className='flex h-full items-center justify-between px-4'>
      <div className='flex items-center gap-2'>
        <MobileSidebar />
        <h2 className=''>SkillSwap</h2>
      </div>

      <div className='flex items-center gap-3'>
        <div className='hidden md:block md:w-96 lg:w-[32rem] xl:w-[40rem]'>
          <SearchBar />
        </div>

        {user && <NotificationBell userId={user.id} />}

        <UserMenu />
      </div>
    </nav>
  )
}
