import { RefreshCw, Zap, Shield, TrendingUp } from 'lucide-react'

export const FeaturesSection = () => {
  return (
    <section className='bg-white py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-6 text-4xl font-bold text-gray-900'>
              Why Choose SkillSwap?
            </h2>
            <p className='text-xl text-gray-600'>
              Our platform is designed to make peer-to-peer learning effective,
              safe, and rewarding.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
            <div className='flex gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100'>
                <RefreshCw className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                  Reciprocal Exchanges
                </h3>
                <p className='text-gray-600'>
                  Find perfect matches where you can teach what they want to
                  learn, and learn what they can teach. True peer-to-peer
                  learning at its finest.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-100'>
                <Zap className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                  Credit System
                </h3>
                <p className='text-gray-600'>
                  Earn credits by teaching others, then use them to learn new
                  skills even when direct exchanges aren&apos;t possible.
                  Maximum flexibility for your learning journey.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100'>
                <Shield className='h-6 w-6 text-purple-600' />
              </div>
              <div>
                <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                  Safe & Trusted
                </h3>
                <p className='text-gray-600'>
                  Comprehensive review system, verified profiles, and community
                  moderation ensure a safe learning environment for everyone.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100'>
                <TrendingUp className='h-6 w-6 text-yellow-600' />
              </div>
              <div>
                <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                  Smart Matching
                </h3>
                <p className='text-gray-600'>
                  Our advanced algorithm considers your skills, interests,
                  availability, and learning style to find the perfect learning
                  partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
