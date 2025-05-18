'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { NotificationList } from './notification-list'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

interface NotificationBellProps {
  userId: string
}

export const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()

  // Fetch unread notifications count
  useEffect(() => {
    async function fetchUnreadCount() {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setUnreadCount(count || 0)
    }

    fetchUnreadCount()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notification-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchUnreadCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  // Fetch recent notifications
  useEffect(() => {
    async function fetchRecentNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])
    }

    fetchRecentNotifications()
  }, [supabase, userId, unreadCount])

  // Mark all notifications as read
  async function markAsRead(notificationId: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
  }

  function handleNotificationClick(notification: any) {
    markAsRead(notification.id)

    // Navigate based on notification type and related content
    if (notification.related_type === 'exchanges' && notification.related_id) {
      router.push(`/dashboard/exchanges/${notification.related_id}`)
    } else if (notification.type === 'new_message') {
      router.push(`/dashboard/messages`)
    } else {
      router.push('/dashboard/notifications')
    }
  }

  function viewAllNotifications() {
    router.push('/dashboard/notifications')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='size-5' />
          {unreadCount > 0 && (
            <span className='absolute top-0 right-1 flex size-4 items-center justify-center rounded-full bg-orange-600 text-[10px] text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className='text-muted-foreground p-4 text-center text-sm'>
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className='focus:bg-muted cursor-pointer p-3'
              onClick={() => handleNotificationClick(notification)}
            >
              <div className='flex w-full items-start gap-2'>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{notification.title}</p>
                  <p className='text-muted-foreground text-xs'>
                    {notification.message}
                  </p>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className='bg-primary mt-1 h-2 w-2 rounded-full' />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer justify-center px-2 py-4 text-sm'
          onClick={viewAllNotifications}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
