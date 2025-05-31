'use client'
import { LogIn, Repeat } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useLoginModal } from '@/hooks/use-login-modal'
import { useGetProfile } from '@/hooks/get-profile'
import { UserMenu } from './user-menu'

export const NavBar = () => {
  const { open } = useLoginModal()

  const { data: user } = useGetProfile()

  return (
    <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm'>
      <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-1 text-2xl font-bold tracking-tighter text-cyan-900'
          >
            <span className='rounded bg-gradient-to-r from-blue-600 to-purple-600 p-1 text-white hover:from-blue-700 hover:to-purple-700'>
              <Repeat className='size-4 text-white' />
            </span>
            SkillSwap
          </Link>
          {user ? (
            <div className='hidden items-center gap-4 md:flex'>
              <Link href='/dashboard'>
                <Button variant='ghost'>Dashboard</Button>
              </Link>
              <Link href='/dashboard/profile'>
                <Button variant='ghost'>Profile</Button>
              </Link>
            </div>
          ) : (
            <div className='hidden items-center gap-4 md:flex'>
              <Link href='/Features'>
                <Button variant='ghost'>Discord</Button>
              </Link>
              <Link href='/about'>
                <Button variant='ghost'>About</Button>
              </Link>
              <Link href='/blog'>
                <Button variant='ghost'>How it works</Button>
              </Link>
              <Link href='/legal/terms'>
                <Button variant='ghost'>Terms</Button>
              </Link>
            </div>
          )}

          <div>
            {user ? (
              <UserMenu />
            ) : (
              <Button onClick={open}>
                <LogIn />
                Login / Signup
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
