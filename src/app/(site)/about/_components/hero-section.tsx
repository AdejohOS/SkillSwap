'use client'
import { Button } from '@/components/ui/button'
import { useLoginModal } from '@/hooks/use-login-modal'
import { ArrowRight, Users, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
  const { open } = useLoginModal()
  return (
    <section className='bg-gradient-to-br from-blue-50 to-indigo-100 py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mb-6 text-5xl font-bold text-gray-900'>
            Learn Anything, Teach Everything
          </h1>
          <p className='mb-8 text-xl leading-relaxed text-gray-600'>
            SkillSwap is the world&apos;s largest peer-to-peer learning
            marketplace where knowledge flows freely. Exchange your skills with
            others, earn credits by teaching, and unlock unlimited learning
            opportunities.
          </p>
          <div className='mb-12 flex flex-col justify-center gap-4 sm:flex-row'>
            <Button
              asChild
              onClick={open}
              size='lg'
              className='flex items-center gap-2 text-lg'
            >
              Start Learning Today
              <ArrowRight className='h-5 w-5' />
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='px-8 text-lg'
            >
              <Link href='/dashboard/discover'>Explore Skills</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className='mx-auto grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='flex items-center justify-center gap-3'>
              <Users className='h-8 w-8 text-blue-600' />
              <div>
                <div className='text-2xl font-bold text-gray-900'>50K+</div>
                <div className='text-sm text-gray-600'>Active Learners</div>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3'>
              <BookOpen className='h-8 w-8 text-green-600' />
              <div>
                <div className='text-2xl font-bold text-gray-900'>1000+</div>
                <div className='text-sm text-gray-600'>Skills Available</div>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3'>
              <Star className='h-8 w-8 text-yellow-600' />
              <div>
                <div className='text-2xl font-bold text-gray-900'>4.9/5</div>
                <div className='text-sm text-gray-600'>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
