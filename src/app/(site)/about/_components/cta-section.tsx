import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const CtaSection = () => {
  return (
    <section className='bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <Sparkles className='mx-auto mb-6 h-16 w-16 text-yellow-300' />
          <h2 className='mb-6 text-4xl font-bold'>
            Ready to Start Your Learning Journey?
          </h2>
          <p className='mb-8 text-xl leading-relaxed text-blue-100'>
            Join SkillSwap today and discover a world where learning has no
            limits. Whether you&apos;re looking to master a new skill or share
            your expertise, your perfect learning partner is waiting.
          </p>

          <div className='mb-8 flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg' variant='secondary' className='text-lg'>
              <Link href='/auth/signup'>
                Join SkillSwap Free
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              className='border text-lg'
              variant='ghost'
            >
              <Link href='/dashboard/discover'>Explore Skills</Link>
            </Button>
          </div>

          <div className='text-sm text-blue-200'>
            <p>
              ✨ No credit card required • 🚀 Start learning in minutes • 🌟
              Join 50,000+ learners
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
