'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface NotificationSettingsProps {
  settings?: {
    email_notifications: boolean
    swap_request_notifications: boolean
    message_notifications: boolean
    session_reminder_notifications: boolean
    swap_status_notifications: boolean
  }
}

export const NotificationSettings = ({
  settings
}: NotificationSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState({
    email_notifications: settings?.email_notifications ?? true,
    swap_request_notifications: settings?.swap_request_notifications ?? true,
    message_notifications: settings?.message_notifications ?? true,
    session_reminder_notifications:
      settings?.session_reminder_notifications ?? true,
    swap_status_notifications: settings?.swap_status_notifications ?? true
  })
  const router = useRouter()
  const supabase = createClient()

  async function saveSettings() {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('You must be logged in to update notification settings')
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: formState,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.user.id)

      if (error) {
        throw error
      }

      toast.success(
        'Your notification settings have been updated successfully.'
      )

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error || typeof error === 'object') {
        toast.error((error as Error)?.message || 'Something went wrong.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggle(key: keyof typeof formState) {
    setFormState(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between space-x-2'>
            <Label
              htmlFor='email_notifications'
              className='flex flex-col space-y-1'
            >
              <span>Email Notifications</span>
              <span className='text-muted-foreground text-sm font-normal'>
                Receive notifications via email
              </span>
            </Label>
            <Switch
              id='email_notifications'
              checked={formState.email_notifications}
              onCheckedChange={() => handleToggle('email_notifications')}
            />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label
              htmlFor='swap_request_notifications'
              className='flex flex-col space-y-1'
            >
              <span>Swap Requests</span>
              <span className='text-muted-foreground text-sm font-normal'>
                Notifications for new swap requests
              </span>
            </Label>
            <Switch
              id='swap_request_notifications'
              checked={formState.swap_request_notifications}
              onCheckedChange={() => handleToggle('swap_request_notifications')}
            />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label
              htmlFor='message_notifications'
              className='flex flex-col space-y-1'
            >
              <span>Messages</span>
              <span className='text-muted-foreground text-sm font-normal'>
                Notifications for new messages
              </span>
            </Label>
            <Switch
              id='message_notifications'
              checked={formState.message_notifications}
              onCheckedChange={() => handleToggle('message_notifications')}
            />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label
              htmlFor='session_reminder_notifications'
              className='flex flex-col space-y-1'
            >
              <span>Session Reminders</span>
              <span className='text-muted-foreground text-sm font-normal'>
                Notifications for upcoming sessions
              </span>
            </Label>
            <Switch
              id='session_reminder_notifications'
              checked={formState.session_reminder_notifications}
              onCheckedChange={() =>
                handleToggle('session_reminder_notifications')
              }
            />
          </div>
          <div className='flex items-center justify-between space-x-2'>
            <Label
              htmlFor='swap_status_notifications'
              className='flex flex-col space-y-1'
            >
              <span>Swap Status Updates</span>
              <span className='text-muted-foreground text-sm font-normal'>
                Notifications when swap status changes
              </span>
            </Label>
            <Switch
              id='swap_status_notifications'
              checked={formState.swap_status_notifications}
              onCheckedChange={() => handleToggle('swap_status_notifications')}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
