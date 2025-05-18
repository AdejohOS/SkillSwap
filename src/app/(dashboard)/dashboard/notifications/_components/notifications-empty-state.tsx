import { Bell } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export const NotificationsEmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You don't have any notifications yet.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full'>
            <Bell className='text-muted-foreground h-10 w-10' />
          </div>
          <h3 className='mt-4 text-lg font-semibold'>No notifications</h3>
          <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
            When you receive notifications about swap requests, messages, or
            session reminders, they will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
