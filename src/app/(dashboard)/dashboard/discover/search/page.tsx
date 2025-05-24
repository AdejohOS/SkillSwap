import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import { AdvancedSearch } from './_components/advanced-search'
import { SearchResultsSkeleton } from '@/components/skeletons/search-results-skeleton'
import { SearchResults } from './_components/search-results'

const Page = async (props: {
  searchParams: Promise<{
    query?: string
    category?: string
    experience?: string
    method?: string
    location?: string
    rating?: string
    available?: string
    reviews?: string
  }>
}) => {
  const supabase = await createClient()
  const searchParams = await props.searchParams

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to search for skills.</div>
  }

  let categoryName = ''
  if (searchParams.category) {
    const { data: category } = await supabase
      .from('skill_categories')
      .select('name')
      .eq('id', searchParams.category)
      .single()

    if (category) {
      categoryName = category.name
    }
  }

  // Construct search description
  let searchDescription = 'Showing all available skills'

  if (searchParams.query) {
    searchDescription = `Results for "${searchParams.query}"`

    if (categoryName) {
      searchDescription += ` in ${categoryName}`
    }

    // Add other filters to description
    const filters = []
    if (searchParams.experience)
      filters.push(`${searchParams.experience} level`)
    if (searchParams.method) filters.push(searchParams.method.replace('_', ' '))
    if (searchParams.location) filters.push(searchParams.location)
    if (searchParams.rating) filters.push(`${searchParams.rating}+ stars`)
    if (searchParams.available === 'true') filters.push('available now')
    if (searchParams.reviews === 'true') filters.push('with reviews')

    if (filters.length > 0) {
      searchDescription += ` (${filters.join(', ')})`
    }
  } else if (Object.keys(searchParams).length > 0) {
    searchDescription = 'Filtered results'

    if (categoryName) {
      searchDescription += ` in ${categoryName}`
    }
  }
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Search Skills</h2>
        <p className='text-muted-foreground'>{searchDescription}</p>
      </div>

      <AdvancedSearch />

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults searchParams={searchParams} userId={user.id} />
      </Suspense>
    </div>
  )
}

export default Page
