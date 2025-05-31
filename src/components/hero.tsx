import { Button } from './ui/button'

import { ArrowRight, BookOpen, Star, Users } from 'lucide-react'
import Link from 'next/link'
export const Hero = () => {
  return (
    <section className='relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20 sm:pt-20 sm:pb-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <div className='mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800'>
            <Star className='mr-2 h-4 w-4' />
            Join thousands of learners worldwide
          </div>

          <h1 className='mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl'>
            Learn Any Skill by{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Teaching Others
            </span>
          </h1>

          <p className='mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600'>
            SkillSwap is the peer learning marketplace where you exchange skills
            with others or use credits to learn from experts. From coding to
            cooking, language to leadership - grow together.
          </p>

          <div className='mb-12 flex flex-col justify-center gap-4 sm:flex-row'>
            <Link href='/auth/signup'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg text-white hover:from-blue-700 hover:to-purple-700'
              >
                Start Learning Today
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='#how-it-works'>
              <Button
                size='lg'
                variant='outline'
                className='border-gray-300 px-8 py-4 text-lg hover:border-gray-400'
              >
                See How It Works
              </Button>
            </Link>
          </div>

          <div className='mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3'>
            <div className='text-center'>
              <div className='mb-2 flex items-center justify-center'>
                <Users className='mr-2 h-6 w-6 text-blue-600' />
                <span className='text-2xl font-bold text-gray-900'>10K+</span>
              </div>
              <p className='text-gray-600'>Active Learners</p>
            </div>
            <div className='text-center'>
              <div className='mb-2 flex items-center justify-center'>
                <BookOpen className='mr-2 h-6 w-6 text-purple-600' />
                <span className='text-2xl font-bold text-gray-900'>500+</span>
              </div>
              <p className='text-gray-600'>Skills Available</p>
            </div>
            <div className='text-center'>
              <div className='mb-2 flex items-center justify-center'>
                <Star className='mr-2 h-6 w-6 text-yellow-500' />
                <span className='text-2xl font-bold text-gray-900'>4.9</span>
              </div>
              <p className='text-gray-600'>Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='animate-blob absolute -top-40 -right-32 h-80 w-80 rounded-full bg-purple-300 opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='animate-blob animation-delay-2000 absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-xl filter'></div>
      </div>
    </section>
  )
}
