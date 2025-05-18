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
    <header className='fixed top-0 z-10 w-full bg-transparent drop-shadow-sm backdrop-blur-md'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-1 text-2xl font-bold tracking-tighter text-cyan-900'
          >
            <span className='rounded bg-cyan-900 p-1'>
              <Repeat className='size-4 text-white' />
            </span>
            Skill<span className='text-orange-600'>Swap</span>
          </Link>

          <div className='hidden items-center gap-4 md:flex'>
            <Link href='/blog'>
              <Button variant='ghost'>Blog</Button>
            </Link>
            <Link href='/blog'>
              <Button variant='ghost'>Terms</Button>
            </Link>
            <Link href='/blog'>
              <Button variant='ghost'>Discord</Button>
            </Link>
          </div>
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
