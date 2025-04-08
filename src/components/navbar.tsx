'use client'
import { LogIn } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useLoginModal } from '@/hooks/use-login-modal'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useGetProfile } from '@/hooks/get-profile'
import { UserMenu } from './user-menu'

export const NavBar = () => {
  const { open } = useLoginModal()

  const { data: user, isLoading } = useGetProfile()

  return (
    <header className='fixed top-0 z-10 w-full bg-transparent drop-shadow-sm backdrop-blur-md'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>
            Skill
            <span className='bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent'>
              Swap
            </span>
          </h2>

          <div className='flex items-center gap-4'>
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
