'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import {
  BookOpen,
  Code,
  Music,
  Palette,
  Utensils,
  Dumbbell,
  Camera,
  PenTool,
  Briefcase,
  Scissors
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'

// Map of category names to icons
const categoryIcons: Record<string, any> = {
  Programming: Code,
  Languages: BookOpen,
  Music: Music,
  'Art & Design': Palette,
  Cooking: Utensils,
  Fitness: Dumbbell,
  Photography: Camera,
  Writing: PenTool,
  Business: Briefcase,
  Crafts: Scissors
}

export function SkillCategoriesList() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true)
      const { data } = await supabase
        .from('skill_categories')
        .select('*')
        .order('name')

      if (data) {
        // Count skills in each category
        const categoriesWithCounts = await Promise.all(
          data.map(async category => {
            const { count } = await supabase
              .from('skill_offerings')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_active', true)

            return {
              ...category,
              count: count || 0
            }
          })
        )

        setCategories(categoriesWithCounts)
      }
      setIsLoading(false)
    }

    fetchCategories()
  }, [supabase])

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className='flex flex-col'>
              <CardHeader>
                <div className='bg-muted mb-2 flex h-12 w-12 items-center justify-center rounded-full' />
                <CardTitle className='bg-muted h-6 w-1/2 rounded' />
                <CardDescription className='bg-muted mt-1 h-4 w-3/4 rounded' />
              </CardHeader>
              <CardContent className='flex-1'>
                <div className='bg-muted h-4 w-full rounded' />
              </CardContent>
              <CardFooter>
                <div className='bg-muted h-10 w-full rounded' />
              </CardFooter>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {categories.map(category => {
        const IconComponent = categoryIcons[category.name] || BookOpen

        return (
          <Card key={category.id} className='flex flex-col'>
            <CardHeader>
              <div className='bg-muted mb-2 flex h-12 w-12 items-center justify-center rounded-full'>
                <IconComponent className='text-primary h-6 w-6' />
              </div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                {category.count} available skills
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1'>
              <p className='text-muted-foreground text-sm'>
                {category.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button className='w-full' variant='outline' asChild>
                <Link href={`/dashboard/discover/category/${category.id}`}>
                  Browse {category.name} Skills
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
