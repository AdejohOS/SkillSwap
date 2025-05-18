'use client'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-y-2'>
      <AlertTriangle className='size-8' />
      <h2 className='text-3xl font-bold tracking-tight sm:text-5xl'>
        Something went wrong!
      </h2>
      <Button variant='ghost'>
        <Link
          href='/'
          className='text-muted-foreground inline-flex items-center gap-3'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <span>Go back home</span>
        </Link>
      </Button>
    </div>
  )
}

export default ErrorPage
