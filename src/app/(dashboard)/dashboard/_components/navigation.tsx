'use client'
import { cn } from '@/lib/utils'
import { SettingsIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill
} from 'react-icons/go'
import {
  RiDashboardHorizontalLine,
  RiGraduationCapFill,
  RiGraduationCapLine
} from 'react-icons/ri'
import { IoBookOutline, IoBookSharp } from 'react-icons/io5'
import { PiUsersThree, PiUsersThreeFill } from 'react-icons/pi'
import { BiMessageSquare, BiSolidMessageSquare } from 'react-icons/bi'
import { MdLightbulb, MdLightbulbOutline } from 'react-icons/md'
import { RiDashboardHorizontalFill } from 'react-icons/ri'

const routes = [
  {
    label: 'Overview',
    href: '',
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
    label: 'Active Swaps',
    href: '/active-swaps',
    icon: PiUsersThree,
    activeIcon: PiUsersThreeFill
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: BiMessageSquare,
    activeIcon: BiSolidMessageSquare
  },
  {
    label: 'Discover',
    href: '/discover',
    icon: MdLightbulbOutline,
    activeIcon: MdLightbulb
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
        const isActive = pathname === fullHref
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
