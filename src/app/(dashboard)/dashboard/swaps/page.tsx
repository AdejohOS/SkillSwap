import { SwapsListSkeleton } from '@/components/skeletons/swap-list-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { Suspense } from 'react'
import { SwapsList } from './_components/swap-list'

const Page = () => {
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>My Swaps</h2>
        <p className='text-muted-foreground'>
          Manage your skill exchanges with other users.
        </p>
      </div>

      <Tabs defaultValue='active' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
          <TabsTrigger value='all'>All Swaps</TabsTrigger>
        </TabsList>
        <TabsContent value='active' className='space-y-4'>
          <Suspense fallback={<SwapsListSkeleton />}>
            <SwapsList status='active' />
          </Suspense>
        </TabsContent>
        <TabsContent value='pending' className='space-y-4'>
          <Suspense fallback={<SwapsListSkeleton />}>
            <SwapsList status='pending' />
          </Suspense>
        </TabsContent>
        <TabsContent value='completed' className='space-y-4'>
          <Suspense fallback={<SwapsListSkeleton />}>
            <SwapsList status='completed' />
          </Suspense>
        </TabsContent>
        <TabsContent value='all' className='space-y-4'>
          <Suspense fallback={<SwapsListSkeleton />}>
            <SwapsList status='all' />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
