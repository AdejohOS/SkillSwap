'use client'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import Link from 'next/link'
import { Navigation } from './navigation'
import { Button } from '@/components/ui/button'
import { Loader, LogOut, Repeat } from 'lucide-react'
import { useLogout } from '@/hooks/use-logout'

export const Sidebar = () => {
  const { mutate: logout, isPending } = useLogout()
  return (
    <aside className='flex h-full w-full flex-col bg-neutral-100 p-4'>
      <Link
        href='/'
        className='flex items-center gap-1 text-2xl font-bold tracking-tighter text-cyan-900'
      >
        <span className='rounded bg-cyan-900 p-1'>
          <Repeat className='size-4 text-white' />
        </span>
        Skill<span className='text-orange-600'>Swap</span>
      </Link>
      <DottedSeparator className='my-4' />

      <div className='flex flex-1 flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto'>
          <Navigation />
        </div>

        <div>
          <DottedSeparator className='my-4' />
          <Button
            onClick={() => logout()}
            className='flex w-full items-center gap-2'
            variant='outline'
            disabled={isPending}
          >
            {isPending ? (
              <Loader className='size-4 animate-spin' />
            ) : (
              <LogOut aria-label='Logout' className='size-4' />
            )}
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
