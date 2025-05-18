'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Search, Filter, X, Calendar, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

export const AdvancedSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Get initial values from URL search params
  const initialQuery = searchParams.get('query') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialExperienceLevel = searchParams.get('experience') || ''
  const initialTeachingMethod = searchParams.get('method') || ''
  const initialLocation = searchParams.get('location') || ''
  const initialRating = searchParams.get('rating') || '0'
  const initialAvailableNow = searchParams.get('available') === 'true'
  const initialHasReviews = searchParams.get('reviews') === 'true'

  // State for search parameters
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [experienceLevel, setExperienceLevel] = useState(initialExperienceLevel)
  const [teachingMethod, setTeachingMethod] = useState(initialTeachingMethod)
  const [location, setLocation] = useState(initialLocation)
  const [minRating, setMinRating] = useState(Number(initialRating))
  const [availableNow, setAvailableNow] = useState(initialAvailableNow)
  const [hasReviews, setHasReviews] = useState(initialHasReviews)

  // State for categories list
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Fetch categories and locations on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('skill_categories')
          .select('id, name')
          .order('name')

        if (categoriesData) {
          setCategories(categoriesData)
        }

        // Fetch distinct locations from profiles
        const { data: locationsData } = await supabase
          .from('profiles')
          .select('location')
          .not('location', 'is', null)
          .order('location')

        if (locationsData) {
          const uniqueLocations = Array.from(
            new Set(locationsData.map(item => item.location).filter(Boolean))
          )
          setLocations(uniqueLocations as string[])
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }

    fetchData()
  }, [supabase])

  // Update active filters when search parameters change
  useEffect(() => {
    const filters = []

    if (category) filters.push('Category')
    if (experienceLevel) filters.push('Experience Level')
    if (teachingMethod) filters.push('Teaching Method')
    if (location) filters.push('Location')
    if (minRating > 0) filters.push('Rating')
    if (availableNow) filters.push('Available Now')
    if (hasReviews) filters.push('Has Reviews')

    setActiveFilters(filters)
  }, [
    category,
    experienceLevel,
    teachingMethod,
    location,
    minRating,
    availableNow,
    hasReviews
  ])

  // Handle search submission
  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()

    setIsLoading(true)

    // Build query string
    const params = new URLSearchParams()

    if (query) params.set('query', query)
    if (category) params.set('category', category)
    if (experienceLevel) params.set('experience', experienceLevel)
    if (teachingMethod) params.set('method', teachingMethod)
    if (location) params.set('location', location)
    if (minRating > 0) params.set('rating', minRating.toString())
    if (availableNow) params.set('available', 'true')
    if (hasReviews) params.set('reviews', 'true')

    // Navigate to search results page
    router.push(`/dashboard/discover/search?${params.toString()}`)
    setIsLoading(false)
  }

  // Reset all filters
  function resetFilters() {
    setCategory('')
    setExperienceLevel('')
    setTeachingMethod('')
    setLocation('')
    setMinRating(0)
    setAvailableNow(false)
    setHasReviews(false)
  }

  // Save search
  async function saveSearch() {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to save searches')
      }

      const searchData = {
        user_id: userData.user.id,
        query,
        filters: {
          category,
          experience_level: experienceLevel,
          teaching_method: teachingMethod,
          location,
          min_rating: minRating,
          available_now: availableNow,
          has_reviews: hasReviews
        },
        created_at: new Date().toISOString()
      }

      const { error } = await supabase.from('saved_searches').insert(searchData)

      if (error) throw error

      toast.success('You can access your saved searches from your profile.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save search. Please try again.')
    }
  }

  return (
    <div className='space-y-4'>
      <form
        onSubmit={handleSearch}
        className='flex w-full items-center space-x-2'
      >
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input
            placeholder='Search skills, topics, or keywords...'
            className='pr-10 pl-8'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              type='button'
              onClick={() => setQuery('')}
              className='text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5'
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Clear search</span>
            </button>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' type='button' className='gap-1.5'>
              <Filter className='h-4 w-4' />
              <span className='hidden sm:inline'>Filters</span>
              {activeFilters.length > 0 && (
                <Badge variant='secondary' className='ml-1'>
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className='p-4 sm:max-w-md'>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect skill match.
              </SheetDescription>
            </SheetHeader>
            <div className='grid gap-6 py-6'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='All Categories' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    <SelectGroup>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='experience'>Experience Level</Label>
                <Select
                  value={experienceLevel}
                  onValueChange={setExperienceLevel}
                >
                  <SelectTrigger id='experience'>
                    <SelectValue placeholder='Any Experience Level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='any'>Any Experience Level</SelectItem>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                    <SelectItem value='expert'>Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='method'>Teaching Method</Label>
                <Select
                  value={teachingMethod}
                  onValueChange={setTeachingMethod}
                >
                  <SelectTrigger id='method'>
                    <SelectValue placeholder='Any Teaching Method' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='any'>Any Teaching Method</SelectItem>
                    <SelectItem value='online'>Online Only</SelectItem>
                    <SelectItem value='in_person'>In-Person Only</SelectItem>
                    <SelectItem value='both'>
                      Both Online & In-Person
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id='location'>
                    <SelectValue placeholder='Any Location' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='any'>Any Location</SelectItem>
                    <SelectGroup>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='rating'>Minimum Rating</Label>
                  <span className='text-sm'>
                    {minRating} {minRating === 1 ? 'star' : 'stars'}
                  </span>
                </div>
                <Slider
                  id='rating'
                  min={0}
                  max={5}
                  step={1}
                  value={[minRating]}
                  onValueChange={value => setMinRating(value[0])}
                  className='py-2'
                />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>Any</span>
                  <span>5 stars</span>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='available-now'
                    checked={availableNow}
                    onCheckedChange={setAvailableNow}
                  />
                  <Label
                    htmlFor='available-now'
                    className='flex items-center gap-2'
                  >
                    <Calendar className='h-4 w-4' />
                    <span>Available Now</span>
                  </Label>
                </div>

                <div className='flex items-center space-x-2'>
                  <Switch
                    id='has-reviews'
                    checked={hasReviews}
                    onCheckedChange={setHasReviews}
                  />
                  <Label
                    htmlFor='has-reviews'
                    className='flex items-center gap-2'
                  >
                    <Star className='h-4 w-4' />
                    <span>Has Reviews</span>
                  </Label>
                </div>
              </div>
            </div>
            <SheetFooter className='flex-col sm:flex-row sm:justify-between sm:space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={resetFilters}
                className='mb-2 sm:mb-0'
              >
                Reset Filters
              </Button>
              <div className='flex space-x-2'>
                <Button type='button' variant='outline' onClick={saveSearch}>
                  Save Search
                </Button>
                <SheetClose asChild>
                  <Button onClick={() => handleSearch()}>Apply Filters</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button type='submit' disabled={isLoading}>
          Search
        </Button>
      </form>

      {activeFilters.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-muted-foreground text-sm'>Active filters:</span>
          {activeFilters.map(filter => (
            <Badge key={filter} variant='secondary'>
              {filter}
            </Badge>
          ))}
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-xs'
            onClick={resetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
