import { PotentialMatchesSkeleton } from '@/components/skeletons/potential-matches-skeleton'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Suspense } from 'react'
import { PotentialMatches } from './_components/potential-matches'
import { AllSkillsListSkeleton } from '@/components/skeletons/all-skill-list-skeleton'
import { AllSkillsList } from './_components/all-skill-list'
import { SkillCategoriesList } from './_components/skill-categories-list'
import { AdvancedSearch } from './search/_components/advanced-search'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Discover</h2>
        <p className='text-muted-foreground'>
          Find skills to learn and potential skill swap matches.
        </p>
      </div>
      <AdvancedSearch />

      <Tabs defaultValue='matches' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='matches'>Potential Matches</TabsTrigger>
          <TabsTrigger value='browse'>Browse Skills</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
        </TabsList>
        <TabsContent value='matches' className='space-y-4'>
          <Suspense fallback={<PotentialMatchesSkeleton />}>
            <PotentialMatches />
          </Suspense>
        </TabsContent>
        <TabsContent value='browse' className='space-y-4'>
          <Suspense fallback={<AllSkillsListSkeleton />}>
            <AllSkillsList />
          </Suspense>
        </TabsContent>
        <TabsContent value='categories' className='space-y-4'>
          <SkillCategoriesList />
        </TabsContent>
      </Tabs>

      <div className='flex justify-center'>
        <Button asChild variant='outline'>
          <Link href='/dashboard/saved-searches'>View Saved Searches</Link>
        </Button>
      </div>
    </div>
  )
}

export default Page
