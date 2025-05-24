'use client'

import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card'
import { DottedSeparator } from '../ui/dotted-separator'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Loader } from 'lucide-react'

export const LoginForm = () => {
  const [loadingProvider, setLoadingProvider] = useState<
    'google' | 'github' | null
  >(null)

  const oAuthSignIn = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'An error occurred during sign up')
      }

      setLoadingProvider(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-center text-3xl font-bold'>
          Welcome to SkillSwap
        </CardTitle>
        <CardDescription className='text-center'>
          Use any of the Login/Signup option
        </CardDescription>
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>

      <CardContent className='p-7'>
        <div className='flex flex-col gap-7'>
          <Button
            type='button'
            className='w-full max-w-xl'
            variant='outline'
            size='lg'
            disabled={loadingProvider !== null}
            onClick={() => oAuthSignIn('google')}
          >
            {loadingProvider === 'google' ? (
              <Loader className='size-4 animate-spin' />
            ) : (
              <FcGoogle className='size-4' />
            )}
            Google
          </Button>
          <Button
            type='button'
            className='w-full max-w-xl'
            variant='outline'
            size='lg'
            disabled={loadingProvider !== null}
            onClick={() => oAuthSignIn('github')}
          >
            {loadingProvider === 'github' ? (
              <Loader className='size-4 animate-spin' />
            ) : (
              <FaGithub className='size-4' />
            )}
            Github
          </Button>
        </div>
      </CardContent>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardFooter className='flex-col gap-4'>
        <p className='text-muted-foreground mt-4 text-center text-sm'>
          By continuing, you confirm that you’ve read and accepted
          SkillSwap&apos;s {''}
          <Link href='/legal/terms' className='text-teal-600 underline'>
            Terms and Conditions
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
