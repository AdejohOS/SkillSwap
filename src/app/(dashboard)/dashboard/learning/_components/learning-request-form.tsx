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
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'

interface LearningRequest {
  id: string
  title: string
  description: string
  category_id: string
  current_skill_level: 'beginner' | 'intermediate' | 'advanced'
  desired_level: 'beginner' | 'intermediate' | 'advanced'
  preferred_learning_method: 'online' | 'in-person' | 'both'
  goals?: string
  availability: {
    weekdays: boolean
    weekends: boolean
    mornings: boolean
    afternoons: boolean
    evenings: boolean
  }
}

interface SkillCategory {
  id: string
  name: string
}

const learningRequestSchema = z.object({
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
  current_skill_level: z.string().default('beginner'),
  desired_level: z.string().default('intermediate'),
  preferred_learning_method: z.string().default('both'),
  goals: z.string().optional(),
  availability: z
    .object({
      weekdays: z.boolean().default(true),
      weekends: z.boolean().default(true),
      mornings: z.boolean().default(false),
      afternoons: z.boolean().default(true),
      evenings: z.boolean().default(true)
    })
    .default({
      weekdays: true,
      weekends: true,
      mornings: false,
      afternoons: true,
      evenings: true
    })
})

type LearningRequestFormValues = z.infer<typeof learningRequestSchema>

export const LearningRequestForm = ({
  request
}: {
  request?: LearningRequest
}) => {
  const [categories, setCategories] = useState<SkillCategory[]>([])
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

  // Parse availability from JSON if it exists
  const availabilityDefaults = request?.availability
    ? typeof request.availability === 'string'
      ? JSON.parse(request.availability)
      : request.availability
    : {
        weekdays: true,
        weekends: true,
        mornings: false,
        afternoons: true,
        evenings: true
      }

  // Default form values
  const defaultValues: Partial<LearningRequestFormValues> = {
    title: request?.title || '',
    description: request?.description || '',
    category_id: request?.category_id?.toString() || '',
    current_skill_level: request?.current_skill_level || 'beginner',
    desired_level: request?.desired_level || 'intermediate',
    preferred_learning_method: request?.preferred_learning_method || 'both',
    goals: request?.goals || '',
    availability: availabilityDefaults
  }

  const form = useForm<LearningRequestFormValues>({
    resolver: zodResolver(
      learningRequestSchema
    ) as Resolver<LearningRequestFormValues>,
    defaultValues
  })

  async function onSubmit(data: LearningRequestFormValues) {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('You must be logged in to add a learning request')
      }

      const requestData = {
        ...data,
        user_id: userData.user.id
      }

      let result

      if (request?.id) {
        // Update existing request
        result = await supabase
          .from('skill_requests')
          .update(requestData)
          .eq('id', request.id)
          .select()
      } else {
        // Insert new request
        result = await supabase
          .from('skill_requests')
          .insert(requestData)
          .select()
      }

      if (result.error) {
        throw result.error
      }

      toast.success(request?.id ? 'Request updated' : 'Request added')

      router.push('/dashboard/learning')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error || typeof error === 'object') {
        toast.error((error as Error)?.message || 'Something went wrong.')
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
                    placeholder='e.g., Learn Spanish Conversation'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A clear title for the skill you want to learn.
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
                  The category that best describes the skill.
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
                  placeholder='Describe what you want to learn and your goals...'
                  className='min-h-32'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about what you want to learn, your goals, and
                any specific areas of focus.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='goals'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='What specific goals do you want to achieve?'
                  className='min-h-20'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe what you hope to accomplish by learning this skill.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 md:grid-cols-3'>
          <FormField
            control={form.control}
            name='current_skill_level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Current Skill Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your current level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='complete_beginner'>
                      Complete Beginner
                    </SelectItem>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How familiar are you with this skill already?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='desired_level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Skill Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select desired level' />
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
                  What level do you want to achieve?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='preferred_learning_method'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Learning Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select learning method' />
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
                  How would you prefer to learn?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='availability'
          render={() => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <div className='mt-2 grid grid-cols-2 gap-4 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='availability.weekdays'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Weekdays</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='availability.weekends'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Weekends</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='availability.mornings'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Mornings</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='availability.afternoons'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Afternoons</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='availability.evenings'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Evenings</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                When are you available for learning sessions?
              </FormDescription>
              <FormMessage />
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
            {request?.id ? 'Update Request' : 'Add Request'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
