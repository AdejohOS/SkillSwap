'use client'
import { cn } from '@/lib/utils'
import { SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiCoinsFill,
  RiCoinsLine,
  RiDashboardHorizontalLine,
  RiGraduationCapFill,
  RiGraduationCapLine
} from 'react-icons/ri'
import { IoBookOutline, IoBookSharp } from 'react-icons/io5'
import { PiUsersThree, PiUsersThreeFill } from 'react-icons/pi'

import { MdLightbulb, MdLightbulbOutline } from 'react-icons/md'
import { RiDashboardHorizontalFill } from 'react-icons/ri'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'

const routes = [
  {
    label: 'Dashboard',
    href: '',
    icon: RiDashboardHorizontalLine,
    activeIcon: RiDashboardHorizontalFill
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: RiDashboardHorizontalLine,
    activeIcon: RiDashboardHorizontalFill
  },
  {
    label: 'My Skills',
    href: '/skills',
    icon: RiGraduationCapLine,
    activeIcon: RiGraduationCapFill
  },
  {
    label: 'My Learning',
    href: '/learning',
    icon: IoBookOutline,
    activeIcon: IoBookSharp
  },
  {
    label: 'Exchanges',
    href: '/exchanges',
    icon: PiUsersThree,
    activeIcon: PiUsersThreeFill
  },
  {
    label: 'Credits',
    href: '/credits',
    icon: RiCoinsLine,
    activeIcon: RiCoinsFill
  },
  {
    label: 'Discover',
    href: '/discover',
    icon: MdLightbulbOutline,
    activeIcon: MdLightbulb
  },
  {
    label: 'Saved Searches',
    href: '/saved-searches',
    icon: FaRegBookmark,
    activeIcon: FaBookmark
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  }
]

export const Navigation = () => {
  const pathname = usePathname()

  return (
    <ul className='flex flex-col'>
      {routes.map(route => {
        const fullHref = `/dashboard${route.href}`
        const isOverview = route.href === ''
        const isActive = isOverview
          ? pathname === '/dashboard'
          : pathname.startsWith(fullHref) || pathname === fullHref
        const Icon = isActive ? route.activeIcon : route.icon

        return (
          <Link key={route.href} href={fullHref}>
            <div
              className={cn(
                'hover:text-primary flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition',
                isActive && 'text-primary bg-white shadow-sm hover:opacity-100'
              )}
            >
              <Icon className='size-5 text-neutral-500' /> {route.label}
            </div>
          </Link>
        )
      })}
    </ul>
  )
}
