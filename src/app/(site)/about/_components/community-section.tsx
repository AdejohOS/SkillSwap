import { Users, Globe2, Heart } from 'lucide-react'

export const CommunitySection = () => {
  return (
    <section className='bg-gradient-to-br from-indigo-50 to-purple-50 py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-4xl font-bold text-gray-900'>
            Join Our Global Community
          </h2>
          <p className='mb-12 text-xl leading-relaxed text-gray-600'>
            SkillSwap brings together learners from every corner of the world,
            creating a diverse ecosystem where cultural exchange happens
            naturally alongside skill development.
          </p>

          <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <Users className='mx-auto mb-4 h-12 w-12 text-blue-600' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Diverse Skills
              </h3>
              <p className='text-gray-600'>
                From coding to cooking, languages to leadership - our community
                teaches everything.
              </p>
            </div>

            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <Globe2 className='mx-auto mb-4 h-12 w-12 text-green-600' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Global Reach
              </h3>
              <p className='text-gray-600'>
                Connect with learners and teachers from over 150 countries
                worldwide.
              </p>
            </div>

            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <Heart className='mx-auto mb-4 h-12 w-12 text-red-600' />
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                Supportive Environment
              </h3>
              <p className='text-gray-600'>
                A welcoming community that celebrates learning, growth, and
                mutual support.
              </p>
            </div>
          </div>

          <blockquote className='mb-8 text-2xl font-medium text-gray-700 italic'>
            &apos;SkillSwap isn&apos;t just about learning new skills -
            it&apos;s about discovering new perspectives, making friends across
            cultures, and realizing that we all have something valuable to
            offer.&apos;
          </blockquote>
          <cite className='text-gray-500'>
            - Sir Nas Moro, Community Member since 2023
          </cite>
        </div>
      </div>
    </section>
  )
}
