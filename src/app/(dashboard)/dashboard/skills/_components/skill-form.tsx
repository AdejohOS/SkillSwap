'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

interface Skill {
  id?: string
  title: string
  description: string | null
  category_id: string | null
  experience_level: string | null
  teaching_method: string | null
  difficulty_level: string | null
  is_active: boolean | null
  session_duration: number | null
  max_students: number | null
}

const skillFormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Title must be at least 3 characters.'
    })
    .max(100, {
      message: 'Title must not be longer than 100 characters.'
    }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.'
    })
    .max(500, {
      message: 'Description must not be longer than 500 characters.'
    }),
  category_id: z.string({
    required_error: 'Please select a category.'
  }),
  experience_level: z.string({
    required_error: 'Please select your experience level.'
  }),
  teaching_method: z.string({
    required_error: 'Please select a teaching method.'
  }),
  difficulty_level: z.string({
    required_error: 'Please select a difficulty level.'
  }),
  is_active: z.boolean().default(true),
  session_duration: z.preprocess(
    val => Number(val),
    z
      .number()
      .min(60, { message: 'Session duration must be at least 60 minutes.' })
  ),
  max_students: z.preprocess(
    val => Number(val),
    z.number().min(1, { message: 'There must be at least 1 student.' })
  )
})

type SkillFormValues = z.infer<typeof skillFormSchema>

export function SkillForm({ skill }: { skill?: Skill }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('skill_categories')
        .select('*')
        .order('name')

      if (data) {
        setCategories(data)
      }
    }

    fetchCategories()
  }, [supabase])

  // Default form values
  const defaultValues: Partial<SkillFormValues> = {
    title: skill?.title || '',
    description: skill?.description || '',
    category_id: skill?.category_id?.toString() || '',
    experience_level: skill?.experience_level || 'intermediate',
    teaching_method: skill?.teaching_method || 'both',
    difficulty_level: skill?.difficulty_level || 'beginner',
    is_active: skill?.is_active ?? true,
    session_duration: skill?.session_duration ?? 60,
    max_students: skill?.max_students ?? 1
  }

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema) as Resolver<SkillFormValues>,
    defaultValues
  })

  async function onSubmit(data: SkillFormValues) {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('You must be logged in to add a skill')
      }

      const skillData = {
        ...data,
        user_id: userData.user.id
      }

      let result

      if (skill?.id) {
        // Update existing skill
        result = await supabase
          .from('skill_offerings')
          .update(skillData)
          .eq('id', skill.id)
          .select()
      } else {
        // Insert new skill
        result = await supabase
          .from('skill_offerings')
          .insert(skillData)
          .select()
      }

      if (result.error) {
        throw result.error
      }

      toast.success(skill?.id ? 'Skill updated' : 'Skill added')

      router.push('/dashboard/skills')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g., JavaScript Programming'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A clear title for the skill you can teach.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The category that best describes your skill.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe what you can teach and your approach...'
                  className='min-h-32'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about what you can teach and your teaching
                approach.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='experience_level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Experience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your experience level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                    <SelectItem value='expert'>Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How experienced are you with this skill?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='difficulty_level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select difficulty level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner-friendly</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                    <SelectItem value='all_levels'>All Levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  What level of students can you teach?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='teaching_method'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teaching Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select teaching method' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='online'>Online Only</SelectItem>
                    <SelectItem value='in_person'>In-Person Only</SelectItem>
                    <SelectItem value='both'>
                      Both Online & In-Person
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How would you prefer to teach?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='session_duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type='number' min='15' max='240' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='max_students'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Students</FormLabel>
                  <FormControl>
                    <Input type='number' min='1' max='20' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name='is_active'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Make this skill active</FormLabel>
                <FormDescription>
                  Active skills are visible to other users and available for
                  swapping.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            {skill?.id ? 'Update Skill' : 'Add Skill'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
