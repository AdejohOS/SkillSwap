import { Input } from '@/components/ui/input'
import { UserMenu } from '@/components/user-menu'
import { Search } from 'lucide-react'
import { MobileSidebar } from './mobile-sidebar'

import { NotificationBell } from '@/components/notifications/notification-bell'
import { createClient } from '@/utils/supabase/server'

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
          <form>
            <div className='relative'>
              <Input
                placeholder='Search skills, users...'
                className='bg-muted pl-8'
                type='search'
              />
              <Search className='absolute inset-y-1.5 left-0 flex items-center pl-2' />
            </div>
          </form>
        </div>

        {user && <NotificationBell userId={user.id} />}

        <UserMenu />
      </div>
    </nav>
  )
}
