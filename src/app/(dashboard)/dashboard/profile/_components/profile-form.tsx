'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters.'
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.'
    }),
  full_name: z.string().optional(),
  bio: z
    .string()
    .max(500, {
      message: 'Bio must not be longer than 500 characters.'
    })
    .optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .optional()
    .or(z.literal('')),
  avatar_url: z.string().optional()
})

interface Profile {
  username: string
  full_name: string | null
  bio: string | null
  location: string | null
  website: string | null
  avatar_url: string | null
}

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ profile }: { profile?: Profile }) {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Default form values
  const defaultValues: Partial<ProfileFormValues> = {
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    avatar_url: profile?.avatar_url || ''
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('You must be logged in to update your profile')
      }

      const profileData = {
        ...data,

        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData.user.id)

      if (error) {
        throw error
      }

      toast.success('Your profile has been updated successfully.')

      router.push('/dashboard/profile')
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
        <FormField
          control={form.control}
          name='avatar_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <div className='flex items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage
                    src={field.value || '/placeholder.svg?height=64&width=64'}
                    alt='Profile'
                  />
                  <AvatarFallback>
                    {form
                      .getValues('username')
                      ?.substring(0, 2)
                      .toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <FormControl>
                  <Input placeholder='URL to your profile picture' {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Enter a URL to your profile picture. You can use services like
                Gravatar or Imgur.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Your username' {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your full name' {...field} />
                </FormControl>
                <FormDescription>
                  This is your full name (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell others about yourself, your skills, and what you're interested in learning..."
                  className='min-h-32'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description about yourself.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder='Your city or region' {...field} />
                </FormControl>
                <FormDescription>
                  Where you&apos;re based (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='website'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder='https://yourwebsite.com' {...field} />
                </FormControl>
                <FormDescription>
                  Your personal website or portfolio (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
