'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLoginModal } from '@/hooks/use-login-modal'

export const JoinCommunity = () => {
  const { open } = useLoginModal()
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20'>
      <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
        <div className='mb-8 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white'>
          <Sparkles className='mr-2 h-4 w-4' />
          Ready to start your learning journey?
        </div>

        <h2 className='mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl'>
          Join SkillSwap Today and{' '}
          <span className='bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
            Unlock Your Potential
          </span>
        </h2>

        <p className='mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-blue-100'>
          Start learning new skills, teaching others, and building meaningful
          connections with learners worldwide. It&apos;s free to join and takes
          less than 2 minutes to get started.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button
            onClick={open}
            size='lg'
            className='bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100'
          >
            Create Free Account
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>

          <Link href='/about'>
            <Button size='lg' className='text-lg font-semibold'>
              Learn More
            </Button>
          </Link>
        </div>

        <div className='mt-8 text-sm text-blue-200'>
          No credit card required • Free forever • Join 10,000+ learners
        </div>
      </div>

      <div className='absolute inset-0 overflow-hidden'>
        <div className='animate-blob absolute -top-40 -right-32 h-80 w-80 rounded-full bg-yellow-400 opacity-10 mix-blend-multiply blur-xl filter'></div>
        <div className='animate-blob animation-delay-2000 absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-pink-400 opacity-10 mix-blend-multiply blur-xl filter'></div>
        <div className='animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-xl filter'></div>
      </div>
    </section>
  )
}
