import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AdvancedSearch } from '../../search/_components/advanced-search'
import { SearchResultsSkeleton } from '@/components/skeletons/search-results-skeleton'
import { CategorySkills } from '../_components/category-skills'

const Page = async ({
  params
}: {
  params: Promise<{ categoryId: string }>
}) => {
  const { categoryId } = await params
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to browse skills by category.</div>
  }

  // Get category details
  const { data: category, error } = await supabase
    .from('skill_categories')
    .select('*')
    .eq('id', categoryId)
    .single()

  if (error || !category) {
    notFound()
  }
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>{category.name}</h2>
        <p className='text-muted-foreground'>
          {category.description ||
            `Browse all skills in the ${category.name} category.`}
        </p>
      </div>

      <AdvancedSearch />

      <Suspense fallback={<SearchResultsSkeleton />}>
        <CategorySkills categoryId={categoryId} userId={user.id} />
      </Suspense>
    </div>
  )
}

export default Page
