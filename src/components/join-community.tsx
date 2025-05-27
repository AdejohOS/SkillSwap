'use client'

import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { useLoginModal } from '@/hooks/use-login-modal'
import { useEffect, useState } from 'react'

export const JoinCommunity = () => {
  const { open } = useLoginModal()
  return (
    <section className='bg-cyan-900 px-4 py-12 text-white md:py-24'>
      <div className='container mx-auto flex max-w-4xl flex-col items-center justify-center text-center'>
        <h2 className='mb-6 text-3xl font-bold md:text-4xl'>
          Ready to Start Learning and Teaching?
        </h2>
        <p className='mb-10 text-lg text-cyan-100 md:text-xl'>
          Join our community of skill-sharers and unlock your potential today.
        </p>
        <Button
          size='lg'
          className='flex items-center gap-2 bg-white text-cyan-900 hover:bg-cyan-100'
          onClick={open}
        >
          Join SkillSwap <ArrowRight className='h-5 w-5' />
        </Button>
      </div>
    </section>
  )
}
