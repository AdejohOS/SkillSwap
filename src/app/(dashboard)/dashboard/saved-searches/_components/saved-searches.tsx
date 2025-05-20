'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash, Clock, Star, Edit, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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

export function SavedSearches({ userId }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchToDelete, setSearchToDelete] = useState<string | null>(null)
  const [editingSearch, setEditingSearch] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
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
        toast.error('Failed to load saved searches. Please try again.')
      } else {
        setSavedSearches(data || [])
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to delete search. Please try again.'
        )
      }
    } finally {
      setSearchToDelete(null)
    }
  }

  // Start editing a search name
  function startEditing(search: any) {
    setEditingSearch(search.id)
    setEditedName(search.name || search.query || 'Unnamed Search')
  }

  // Save edited search name
  async function saveSearchName(searchId: string) {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ name: editedName })
        .eq('id', searchId)
      if (error) throw error

      setSavedSearches(prev =>
        prev.map(search =>
          search.id === searchId ? { ...search, name: editedName } : search
        )
      )
      toast.success('Your saved search has been renamed.')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to update search. Please try again.'
        )
      }
    } finally {
      setEditingSearch(null)
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
              <Star className='text-muted-foreground h-10 w-10' />
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
                {editingSearch === search.id ? (
                  <div className='mb-2 flex items-center gap-2'>
                    <Input
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className='max-w-xs'
                      autoFocus
                    />
                    <Button
                      size='sm'
                      onClick={() => saveSearchName(search.id)}
                      disabled={!editedName.trim()}
                    >
                      <Save className='mr-1 h-4 w-4' />
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => setEditingSearch(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <h4 className='font-medium'>
                      {search.name || search.query || 'Unnamed Search'}
                    </h4>
                    {search.filters &&
                      Object.keys(search.filters).filter(
                        key => search.filters[key]
                      ).length > 0 && (
                        <Badge variant='secondary'>
                          {
                            Object.keys(search.filters).filter(
                              key => search.filters[key]
                            ).length
                          }{' '}
                          filters
                        </Badge>
                      )}
                  </div>
                )}

                {!editingSearch && (
                  <>
                    <div className='text-muted-foreground flex items-center text-sm'>
                      <Clock className='mr-1 h-3 w-3' />
                      <span>
                        Saved on{' '}
                        {new Date(search.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {search.query && (
                      <div className='mt-1 text-sm'>
                        <span className='text-muted-foreground'>Query: </span>
                        <span>{search.query}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => executeSearch(search)}
                >
                  Search
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => startEditing(search)}
                >
                  <Edit className='h-4 w-4' />
                  <span className='sr-only'>Edit search</span>
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
