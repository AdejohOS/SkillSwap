import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/server'
import React from 'react'
import { NotificationSettings } from '../notifications/_components/notifications-settings'

const Page = async () => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view your settings.</div>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('notification_settings')
    .eq('id', user.id)
    .single()
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue='notifications' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='privacy'>Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value='notifications' className='space-y-4'>
          <NotificationSettings settings={profile?.notification_settings} />
        </TabsContent>
        <TabsContent value='account' className='space-y-4'>
          <div className='rounded-lg border p-8 text-center'>
            <h3 className='font-medium'>Account Settings</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Account settings will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
        <TabsContent value='privacy' className='space-y-4'>
          <div className='rounded-lg border p-8 text-center'>
            <h3 className='font-medium'>Privacy Settings</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Privacy settings will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
