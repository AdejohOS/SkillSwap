'use client'

import Link from 'next/link'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Search, Trash, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface SavedSearchesProps {
  userId: string
}

export const SavedSearches = ({ userId }: SavedSearchesProps) => {
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchToDelete, setSearchToDelete] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch saved searches
  useEffect(() => {
    async function fetchSavedSearches() {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching saved searches:', error)
        setIsLoading(false)
        return
      }

      setSavedSearches(data || [])
      setIsLoading(false)
    }

    fetchSavedSearches()
  }, [supabase, userId])

  // Delete a saved search
  async function deleteSearch(searchId: string) {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)

      if (error) throw error

      setSavedSearches(prev => prev.filter(search => search.id !== searchId))

      toast.success('Your saved search has been deleted.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete search. Please try again.')
    } finally {
      setSearchToDelete(null)
    }
  }

  // Execute a saved search
  function executeSearch(search: any) {
    const params = new URLSearchParams()

    if (search.query) params.set('query', search.query)

    if (search.filters) {
      if (search.filters.category)
        params.set('category', search.filters.category)
      if (search.filters.experience_level)
        params.set('experience', search.filters.experience_level)
      if (search.filters.teaching_method)
        params.set('method', search.filters.teaching_method)
      if (search.filters.location)
        params.set('location', search.filters.location)
      if (search.filters.min_rating > 0)
        params.set('rating', search.filters.min_rating.toString())
      if (search.filters.available_now) params.set('available', 'true')
      if (search.filters.has_reviews) params.set('reviews', 'true')
    }

    router.push(`/dashboard/discover/search?${params.toString()}`)
  }

  // Format the search date
  function formatSearchDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  // Get active filters count
  function getActiveFiltersCount(filters: any) {
    if (!filters) return 0

    let count = 0
    if (filters.category) count++
    if (filters.experience_level) count++
    if (filters.teaching_method) count++
    if (filters.location) count++
    if (filters.min_rating > 0) count++
    if (filters.available_now) count++
    if (filters.has_reviews) count++

    return count
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
          <CardDescription>Loading your saved searches...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center p-8'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (savedSearches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
          <CardDescription>You haven't saved any searches yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center p-8 text-center'>
            <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full'>
              <Search className='text-muted-foreground h-10 w-10' />
            </div>
            <h3 className='mt-4 text-lg font-semibold'>No saved searches</h3>
            <p className='text-muted-foreground mt-2 mb-4 max-w-sm text-sm'>
              Save your searches to quickly access them later. You can save a
              search by clicking the "Save Search" button in the search filters.
            </p>
            <Button asChild>
              <Link href='/dashboard/discover'>Start Searching</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Searches</CardTitle>
        <CardDescription>Quickly access your saved searches.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {savedSearches.map(search => (
            <div
              key={search.id}
              className='flex items-center justify-between rounded-lg border p-4'
            >
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-medium'>
                    {search.query || 'All Skills'}
                  </h4>
                  {getActiveFiltersCount(search.filters) > 0 && (
                    <Badge variant='secondary'>
                      {getActiveFiltersCount(search.filters)} filter
                      {getActiveFiltersCount(search.filters) !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className='text-muted-foreground flex items-center text-sm'>
                  <Clock className='mr-1 h-3 w-3' />
                  <span>Saved on {formatSearchDate(search.created_at)}</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => executeSearch(search)}
                >
                  Search
                </Button>
                <AlertDialog
                  open={searchToDelete === search.id}
                  onOpenChange={open => !open && setSearchToDelete(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:text-destructive h-8 w-8'
                      onClick={() => setSearchToDelete(search.id)}
                    >
                      <Trash className='h-4 w-4' />
                      <span className='sr-only'>Delete search</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete saved search?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your saved search.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteSearch(search.id)}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
