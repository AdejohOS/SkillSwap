import { Target, Heart, Globe } from 'lucide-react'

export const MissionSection = () => {
  return (
    <section className='bg-white py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-16 text-center'>
            <h2 className='mb-6 text-4xl font-bold text-gray-900'>
              Our Mission
            </h2>
            <p className='text-xl leading-relaxed text-gray-600'>
              We believe that everyone has something valuable to teach and
              something important to learn. SkillSwap breaks down barriers to
              education by creating a global community where knowledge is the
              currency and learning never stops.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                <Target className='h-8 w-8 text-blue-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Democratize Learning
              </h3>
              <p className='text-gray-600'>
                Make quality education accessible to everyone, regardless of
                location, background, or financial situation.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                <Heart className='h-8 w-8 text-green-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Build Community
              </h3>
              <p className='text-gray-600'>
                Foster meaningful connections between learners and teachers,
                creating lasting relationships beyond skill exchange.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100'>
                <Globe className='h-8 w-8 text-purple-600' />
              </div>
              <h3 className='mb-3 text-xl font-semibold text-gray-900'>
                Connect Globally
              </h3>
              <p className='text-gray-600'>
                Bridge cultural and geographical gaps by connecting learners
                from around the world through shared knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
