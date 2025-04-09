'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserMenu } from '@/components/user-menu'
import { Bell, Menu, MessageSquare, Search } from 'lucide-react'
import { MobileSidebar } from './mobile-sidebar'

export const DashboardNavbar = () => {
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

        <Button variant='ghost' size='icon' type='button'>
          <Bell className='size-5' />
        </Button>
        <Button variant='ghost' size='icon' type='button'>
          <MessageSquare className='size-5' />
        </Button>
        <UserMenu />
      </div>
    </nav>
  )
}
