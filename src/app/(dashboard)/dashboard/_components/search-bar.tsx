'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Search, Clock, TrendingUp, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/utils/supabase/client'

interface SearchResult {
  id: string
  title: string
  description: string | null
  user_id: string
  category_name: string
  username: string
  avatar_url: string | null
}

interface RecentSearch {
  query: string
  timestamp: number
}

interface Profile {
  username: string
  avatar_url: string | null
}

interface SkillCategory {
  id: string
  name: string
}

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [popularSkills, setPopularSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skillswap-recent-searches')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentSearches(parsed.slice(0, 5)) // Keep only last 5
      } catch (error) {
        console.error('Error parsing recent searches:', error)
      }
    }
  }, [])

  // Fetch popular skills on mount
  useEffect(() => {
    async function fetchPopularSkills() {
      try {
        const { data } = await supabase
          .from('skill_offerings')
          .select('title')
          .eq('is_active', true)
          .limit(5)
          .order('created_at', { ascending: false })

        if (data) {
          setPopularSkills(data.map(skill => skill.title))
        }
      } catch (error) {
        console.error('Error fetching popular skills:', error)
      }
    }

    fetchPopularSkills()
  }, [supabase])

  // Search function with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const { data } = await supabase
          .from('skill_offerings')
          .select(
            `
            id,
            title,
            description,
            user_id,
            skill_categories(name),
            profiles(username, avatar_url)
          `
          )
          .eq('is_active', true)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(6)

        if (data) {
          const formattedResults: SearchResult[] = data.map(skill => ({
            id: skill.id,
            title: skill.title,
            description: skill.description,
            user_id: skill.user_id,
            category_name:
              (skill.skill_categories as SkillCategory)?.name ||
              'Uncategorized',
            username: (skill.profiles as Profile)?.username || 'Unknown',
            avatar_url: (skill.profiles as Profile)?.avatar_url || null
          }))
          setResults(formattedResults)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, supabase])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save search to recent searches
  function saveRecentSearch(searchQuery: string) {
    const newSearch: RecentSearch = {
      query: searchQuery,
      timestamp: Date.now()
    }

    const updated = [
      newSearch,
      ...recentSearches.filter(s => s.query !== searchQuery)
    ].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('skillswap-recent-searches', JSON.stringify(updated))
  }

  // Handle search submission
  function handleSearch(searchQuery?: string) {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    saveRecentSearch(finalQuery)
    setIsOpen(false)
    setQuery('')
    router.push(
      `/dashboard/discover/search?query=${encodeURIComponent(finalQuery)}`
    )
  }

  // Handle keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  // Clear recent searches
  function clearRecentSearches() {
    setRecentSearches([])
    localStorage.removeItem('skillswap-recent-searches')
  }

  return (
    <div ref={searchRef} className='relative w-full'>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          ref={inputRef}
          type='search'
          placeholder='Search skills...'
          className='pr-4 pl-9'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <Card className='absolute top-full z-50 mt-1 w-full shadow-lg'>
          <CardContent className='p-0'>
            {/* Search Results */}
            {query.trim() && (
              <div className='border-b'>
                <div className='p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <h4 className='text-sm font-medium'>Search Results</h4>
                    {isLoading && (
                      <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                    )}
                  </div>

                  {results.length > 0 ? (
                    <div className='space-y-2'>
                      {results.map(result => (
                        <div
                          key={result.id}
                          className='hover:bg-muted flex cursor-pointer items-start space-x-3 rounded-lg p-2'
                          onClick={() =>
                            router.push(
                              `/dashboard/discover/skill/${result.id}`
                            )
                          }
                        >
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={
                                result.avatar_url ||
                                '/placeholder.svg?height=32&width=32'
                              }
                            />
                            <AvatarFallback>
                              {result.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-medium'>
                              {result.title}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                              by {result.username}
                            </p>
                            <Badge variant='secondary' className='mt-1 text-xs'>
                              {result.category_name}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start text-xs'
                        onClick={() => handleSearch()}
                      >
                        View all results for &apos;{query}&apos;
                      </Button>
                    </div>
                  ) : (
                    !isLoading && (
                      <p className='text-muted-foreground text-sm'>
                        No skills found for &apos;{query}&apos;
                      </p>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className='border-b'>
                <div className='p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <h4 className='flex items-center gap-1 text-sm font-medium'>
                      <Clock className='h-3 w-3' />
                      Recent Searches
                    </h4>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-auto p-0 text-xs'
                      onClick={clearRecentSearches}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className='space-y-1'>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className='hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg p-2'
                        onClick={() => handleSearch(search.query)}
                      >
                        <span className='text-sm'>{search.query}</span>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-auto p-1'
                          onClick={e => {
                            e.stopPropagation()
                            setQuery(search.query)
                          }}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Popular Skills */}
            {!query.trim() && popularSkills.length > 0 && (
              <div className='p-3'>
                <h4 className='mb-2 flex items-center gap-1 text-sm font-medium'>
                  <TrendingUp className='h-3 w-3' />
                  Popular Skills
                </h4>
                <div className='space-y-1'>
                  {popularSkills.map((skill, index) => (
                    <div
                      key={index}
                      className='hover:bg-muted cursor-pointer rounded-lg p-2'
                      onClick={() => handleSearch(skill)}
                    >
                      <span className='text-sm'>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
