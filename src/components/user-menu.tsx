'use client'

import { useGetProfile } from '@/hooks/get-profile'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LayoutDashboard, Loader, LogOut } from 'lucide-react'
import { DottedSeparator } from './ui/dotted-separator'

export const UserMenu = () => {
  const { data: user, isLoading } = useGetProfile()

  const router = useRouter()

  if (isLoading) {
    return (
      <div className='flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200'>
        <Loader className='text-muted-foreground size-4 animate-spin' />
      </div>
    )
  }

  const { full_name, avatar_url, username, email } = user || {
    full_name: '',
    avatar_url: ''
  }

  const avatarFallback = full_name
    ? full_name.charAt(0).toUpperCase()
    : (email?.charAt(0).toLocaleUpperCase() ?? 'U')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className='relative outline-none'>
        <Avatar className='size-10 border border-neutral-700 transition hover:opacity-75'>
          <AvatarImage src={avatar_url || ''} />
          <AvatarFallback className='flex items-center justify-center bg-neutral-200 font-medium text-neutral-500'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='bottom'
        className='w-60'
        sideOffset={10}
      >
        <div className='flex flex-col items-center justify-center gap-2 px-2.5 py-4'>
          <Avatar className='size-[52px] border border-neutral-700'>
            <AvatarFallback className='flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-neutral text-sm font-medium'>
              {full_name || 'User'}
            </p>
            <p className='text-xs text-neutral-500'>{email}</p>
          </div>
        </div>
        <DottedSeparator className='mb-1' />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className='flex h-10 cursor-pointer items-center font-medium'
        >
          <LayoutDashboard className='mr-2 size-4' /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className='flex h-10 cursor-pointer items-center font-medium text-amber-700'>
          <LogOut className='mr-2 size-4' /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
