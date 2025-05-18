'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Bell, MessageSquare, Users, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface NotificationListProps {
  onNotificationClick?: () => void
  limit?: number
  showViewAll?: boolean
}

export const NotificationList = ({
  onNotificationClick,
  limit = 5,
  showViewAll = true
}: NotificationListProps) => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching notifications:', error)
        setIsLoading(false)
        return
      }

      setNotifications(data || [])
      setIsLoading(false)
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, limit])

  // Mark a notification as read and navigate to related content
  async function handleNotificationClick(notification: any) {
    try {
      // Mark as read if not already read
      if (!notification.is_read) {
        const { error } = await supabase.rpc('mark_notification_as_read', {
          notification_uuid: notification.id
        })

        if (error) throw error
      }

      // Navigate based on notification type and related content
      if (notification.related_type === 'swaps' && notification.related_id) {
        router.push(`/dashboard/swaps/${notification.related_id}`)
      } else if (notification.type === 'new_message') {
        router.push(`/dashboard/messages`)
      } else {
        router.push('/dashboard')
      }

      // Call the callback if provided
      if (onNotificationClick) {
        onNotificationClick()
      }
    } catch (error: any) {
      toast.error('Failed to process notification')
    }
  }

  // Get icon based on notification type
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'swap_request':
      case 'swap_accepted':
      case 'swap_rejected':
      case 'swap_completed':
        return <Users className='text-primary h-5 w-5' />
      case 'new_message':
        return <MessageSquare className='text-primary h-5 w-5' />
      case 'session_reminder':
        return <Calendar className='text-primary h-5 w-5' />
      default:
        return <Bell className='text-primary h-5 w-5' />
    }
  }

  // Format the notification date
  function formatNotificationDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Loading notifications...
        </p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center'>
        <Bell className='text-muted-foreground mb-2 h-10 w-10' />
        <h3 className='font-medium'>No notifications</h3>
        <p className='text-muted-foreground text-sm'>
          You don't have any notifications yet.
        </p>
      </div>
    )
  }

  return (
    <div>
      <ScrollArea className='max-h-[300px]'>
        <div className='flex flex-col'>
          {notifications.map(notification => (
            <button
              key={notification.id}
              className={cn(
                'hover:bg-muted flex items-start gap-3 border-b p-4 text-left transition-colors',
                !notification.is_read && 'bg-muted/50'
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className='mt-1 flex-shrink-0'>
                {getNotificationIcon(notification.type)}
              </div>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{notification.title}</p>
                  {!notification.is_read && (
                    <span className='bg-primary flex h-2 w-2 rounded-full' />
                  )}
                </div>
                <p className='text-muted-foreground line-clamp-2 text-sm'>
                  {notification.message}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {formatNotificationDate(notification.created_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      {showViewAll && (
        <div className='border-t p-2'>
          <Button
            variant='ghost'
            className='w-full justify-center'
            onClick={() => router.push('/dashboard/notifications')}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  )
}
