import { BookOpen, MessageCircle, Star, Users } from 'lucide-react'

export const CoreFeatures = () => {
  return (
    <section className='px-4 py-12 md:py-24'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-16 text-center text-3xl font-bold text-cyan-900 md:text-4xl'>
          Core Features
        </h2>

        <div className='grid gap-10 md:grid-cols-2'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-200'>
              <BookOpen className='h-6 w-6 text-cyan-700' />
            </div>
            <div>
              <h3 className='mb-2 text-xl font-semibold text-cyan-800'>
                Skill Offerings & Requests
              </h3>
              <p className='text-gray-600'>
                List skills you can teach and post what you want to learn. Our
                matching system helps you find the perfect swap.
              </p>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-200'>
              <Users className='h-6 w-6 text-cyan-700' />
            </div>
            <div>
              <h3 className='mb-2 text-xl font-semibold text-cyan-800'>
                Flexible Swaps
              </h3>
              <p className='text-gray-600'>
                Choose between one-way swaps (just learn or just teach) or
                reciprocal swaps (exchange skills with each other).
              </p>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-200'>
              <MessageCircle className='h-6 w-6 text-cyan-700' />
            </div>
            <div>
              <h3 className='mb-2 text-xl font-semibold text-cyan-800'>
                Integrated Messaging
              </h3>
              <p className='text-gray-600'>
                Communicate directly with potential teachers or students to
                coordinate your learning sessions.
              </p>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-200'>
              <Star className='h-6 w-6 text-cyan-700' />
            </div>
            <div>
              <h3 className='mb-2 text-xl font-semibold text-cyan-800'>
                Reviews & Ratings
              </h3>
              <p className='text-gray-600'>
                Build your reputation as a teacher or learner through our
                community-driven feedback system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
