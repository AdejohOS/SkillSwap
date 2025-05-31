import { TrendingUp, Clock, Globe, Award } from 'lucide-react'

export const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      number: '50K+',
      label: 'Skills Exchanged',
      description: 'Successful learning sessions completed'
    },
    {
      icon: Clock,
      number: '100K+',
      label: 'Hours Learned',
      description: 'Total learning time on the platform'
    },
    {
      icon: Globe,
      number: '150+',
      label: 'Countries',
      description: 'Global community of learners'
    },
    {
      icon: Award,
      number: '95%',
      label: 'Success Rate',
      description: 'Positive learning experiences'
    }
  ]

  return (
    <section className='bg-gradient-to-r from-blue-600 to-purple-600 py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>
            Trusted by Learners Worldwide
          </h2>
          <p className='mx-auto max-w-2xl text-xl text-blue-100'>
            Join a thriving community that's transforming how people learn and
            share knowledge
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20'>
                <div className='mb-4 flex justify-center'>
                  <stat.icon className='h-8 w-8 text-white' />
                </div>
                <div className='mb-2 text-3xl font-bold text-white sm:text-4xl'>
                  {stat.number}
                </div>
                <div className='mb-1 text-lg font-semibold text-blue-100'>
                  {stat.label}
                </div>
                <div className='text-sm text-blue-200'>{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
