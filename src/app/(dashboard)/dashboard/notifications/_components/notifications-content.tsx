'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  Bell,
  Check,
  MessageSquare,
  Users,
  Calendar,
  Filter
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { NotificationsEmptyState } from './notifications-empty-state'

interface NotificationsContentProps {
  userId: string
}

export function NotificationsContent({ userId }: NotificationsContentProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (filter) {
        query = query.eq('type', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching notifications:', error)
        setIsLoading(false)
        return
      }

      setNotifications(data || [])
      setIsLoading(false)
    }

    fetchNotifications()

    // Subscribe to notification changes
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, filter])

  // Mark all notifications as read
  async function markAllAsRead() {
    try {
      const { error } = await supabase.rpc('mark_all_notifications_as_read', {
        user_uuid: userId
      })

      if (error) throw error

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      )

      toast.success('All notifications marked as read')
    } catch (error: any) {
      toast.error('Failed to mark notifications as read')
    }
  }

  // Mark a single notification as read
  async function markAsRead(notificationId: string) {
    try {
      const { error } = await supabase.rpc('mark_notification_as_read', {
        notification_uuid: notificationId
      })

      if (error) throw error

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (error: any) {
      toast.error('Failed to mark notification as read')
    }
  }

  // Handle notification click
  function handleNotificationClick(notification: any) {
    // Mark as read if not already read
    if (!notification.is_read) {
      markAsRead(notification.id)
    }

    // Navigate based on notification type and related content
    if (notification.related_type === 'swaps' && notification.related_id) {
      router.push(`/dashboard/swaps/${notification.related_id}`)
    } else if (notification.type === 'new_message') {
      router.push(`/dashboard/messages`)
    } else {
      router.push('/dashboard')
    }
  }

  // Get icon based on notification type
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'swap_request':
        return <Users className='h-5 w-5 text-blue-500' />
      case 'swap_accepted':
        return <Check className='h-5 w-5 text-green-500' />
      case 'swap_rejected':
        return <Users className='h-5 w-5 text-red-500' />
      case 'swap_completed':
        return <Users className='h-5 w-5 text-purple-500' />
      case 'new_message':
        return <MessageSquare className='h-5 w-5 text-indigo-500' />
      case 'session_reminder':
        return <Calendar className='h-5 w-5 text-yellow-500' />
      default:
        return <Bell className='h-5 w-5 text-gray-500' />
    }
  }

  // Format the notification date
  function formatNotificationDate(dateString: string) {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Loading your notifications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center p-8'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (notifications.length === 0) {
    return <NotificationsEmptyState />
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread notification
            {unreadCount !== 1 ? 's' : ''}.
          </CardDescription>
        </div>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter(null)}>
                All notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('swap_request')}>
                Swap requests
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('swap_accepted')}>
                Accepted swaps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('new_message')}>
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('session_reminder')}>
                Session reminders
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {unreadCount > 0 && (
            <Button size='sm' onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='all' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>Unread</TabsTrigger>
          </TabsList>
          <TabsContent value='all' className='space-y-4'>
            <div className='space-y-4'>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    'hover:bg-muted flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors',
                    !notification.is_read && 'bg-muted/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='mt-1'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <p className='font-medium'>{notification.title}</p>
                      {!notification.is_read && (
                        <span className='bg-primary flex h-2 w-2 rounded-full' />
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {notification.message}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {formatNotificationDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='unread' className='space-y-4'>
            {notifications.filter(n => !n.is_read).length === 0 ? (
              <div className='flex flex-col items-center justify-center p-8 text-center'>
                <Check className='text-muted-foreground mb-2 h-10 w-10' />
                <h3 className='font-medium'>All caught up!</h3>
                <p className='text-muted-foreground text-sm'>
                  You have no unread notifications.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {notifications
                  .filter(n => !n.is_read)
                  .map(notification => (
                    <div
                      key={notification.id}
                      className='bg-muted/50 hover:bg-muted flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors'
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className='mt-1'>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium'>{notification.title}</p>
                          <span className='bg-primary flex h-2 w-2 rounded-full' />
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {notification.message}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {formatNotificationDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
