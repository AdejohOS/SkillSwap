import { TrendingUp, Clock, Star, Users } from 'lucide-react'

export const StatsSection = () => {
  return (
    <section className='bg-gray-900 py-20 text-white'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-6 text-4xl font-bold'>
              SkillSwap by the Numbers
            </h2>
            <p className='text-xl text-gray-300'>
              See the impact our community is making in the world of
              peer-to-peer learning.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <div className='mb-2 text-3xl font-bold'>50,000+</div>
              <div className='text-gray-300'>Active Users</div>
              <div className='mt-1 text-sm text-green-400'>
                <TrendingUp className='mr-1 inline h-4 w-4' />
                +25% this month
              </div>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600'>
                <Clock className='h-8 w-8 text-white' />
              </div>
              <div className='mb-2 text-3xl font-bold'>100,000+</div>
              <div className='text-gray-300'>Learning Hours</div>
              <div className='mt-1 text-sm text-green-400'>
                <TrendingUp className='mr-1 inline h-4 w-4' />
                +40% this month
              </div>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600'>
                <Star className='h-8 w-8 text-white' />
              </div>
              <div className='mb-2 text-3xl font-bold'>4.9/5</div>
              <div className='text-gray-300'>Average Rating</div>
              <div className='mt-1 text-sm text-gray-400'>
                Based on 15,000+ reviews
              </div>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600'>
                <TrendingUp className='h-8 w-8 text-white' />
              </div>
              <div className='mb-2 text-3xl font-bold'>1,200+</div>
              <div className='text-gray-300'>Skill Categories</div>
              <div className='mt-1 text-sm text-green-400'>
                <TrendingUp className='mr-1 inline h-4 w-4' />
                +50 new this week
              </div>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <p className='mb-8 text-lg text-gray-300'>
              Join thousands of learners who are already transforming their
              lives through skill exchange.
            </p>
            <div className='flex flex-wrap justify-center gap-8 text-sm text-gray-400'>
              <span>🌍 Available in 150+ countries</span>
              <span>💬 Support for 25+ languages</span>
              <span>📱 Mobile app coming soon</span>
              <span>🔒 100% secure platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
