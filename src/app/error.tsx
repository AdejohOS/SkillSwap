'use client'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-y-2'>
      <AlertTriangle className='size-6' />
      <p className='text-muted-foreground text-sm'>Something went wrong!</p>
      <Button variant='secondary' size='sm'>
        <Link href='/'>Back home</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
