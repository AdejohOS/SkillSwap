import { ExchangesListSkeleton } from '@/components/skeletons/exchanges-list-skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { ExchangesList } from './_components/exchanges-list'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div className='p-4'>Please sign in to view your exchanges.</div>
  }
  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Skill Exchanges</h2>
          <p className='text-muted-foreground'>
            Manage your reciprocal skill exchanges with other users.
          </p>
        </div>
        <Button asChild>
          <Link href='/dashboard/exchanges/find'>Find Exchange Partners</Link>
        </Button>
      </div>

      <Tabs defaultValue='active' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
          <TabsTrigger value='all'>All Exchanges</TabsTrigger>
        </TabsList>
        <TabsContent value='active' className='space-y-4'>
          <Suspense fallback={<ExchangesListSkeleton />}>
            <ExchangesList userId={user.id} status='active' />
          </Suspense>
        </TabsContent>
        <TabsContent value='pending' className='space-y-4'>
          <Suspense fallback={<ExchangesListSkeleton />}>
            <ExchangesList userId={user.id} status='pending' />
          </Suspense>
        </TabsContent>
        <TabsContent value='completed' className='space-y-4'>
          <Suspense fallback={<ExchangesListSkeleton />}>
            <ExchangesList userId={user.id} status='completed' />
          </Suspense>
        </TabsContent>
        <TabsContent value='all' className='space-y-4'>
          <Suspense fallback={<ExchangesListSkeleton />}>
            <ExchangesList userId={user.id} status='all' />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
