import { UserPlus, Search, MessageCircle, Award } from 'lucide-react'

export const HowItWorksSection = () => {
  return (
    <section className='bg-gray-50 py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-6 text-4xl font-bold text-gray-900'>
              How SkillSwap Works
            </h2>
            <p className='text-xl text-gray-600'>
              Getting started is simple. Follow these four easy steps to begin
              your learning journey.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
                <UserPlus className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                1. Create Profile
              </h3>
              <p className='text-gray-600'>
                Sign up and list the skills you can teach and what you&apos;d
                like to learn.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600'>
                <Search className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                2. Find Matches
              </h3>
              <p className='text-gray-600'>
                Discover perfect learning partners through our smart matching
                algorithm.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600'>
                <MessageCircle className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                3. Connect & Learn
              </h3>
              <p className='text-gray-600'>
                Start conversations, schedule sessions, and begin exchanging
                knowledge.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                4. Earn & Grow
              </h3>
              <p className='text-gray-600'>
                Earn credits by teaching, leave reviews, and expand your skill
                network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
