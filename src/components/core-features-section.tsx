import {
  ArrowLeftRight,
  Coins,
  Users,
  Shield,
  Search,
  Star
} from 'lucide-react'

export const CoreFeaturesSection = () => {
  const features = [
    {
      icon: ArrowLeftRight,
      title: 'Reciprocal Skill Exchange',
      description:
        'Trade your expertise for new knowledge. Teach what you know, learn what you need.',
      color: 'text-blue-600'
    },
    {
      icon: Coins,
      title: 'Credit-Based Learning',
      description:
        "Earn credits by teaching others, spend them to learn from experts when you can't offer a skill in return.",
      color: 'text-yellow-600'
    },
    {
      icon: Search,
      title: 'Smart Matching',
      description:
        'Our algorithm finds perfect learning partners based on your skills, interests, and availability.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Global Community',
      description:
        'Connect with learners and teachers from around the world. Learn languages, cultures, and perspectives.',
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      description:
        'Review and rating system ensures high-quality learning experiences for everyone.',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description:
        'Verified profiles, secure messaging, and dispute resolution keep your learning journey safe.',
      color: 'text-red-600'
    }
  ]

  return (
    <section id='features' className='bg-white py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl'>
            Everything You Need to{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Learn & Teach
            </span>
          </h2>
          <p className='mx-auto max-w-2xl text-xl text-gray-600'>
            SkillSwap provides all the tools and features you need for
            successful peer-to-peer learning
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='rounded-xl bg-gray-50 p-6 transition-shadow duration-300 hover:shadow-lg'
            >
              <div className='mb-4 flex items-center gap-2'>
                <div className={`rounded-lg bg-white p-3 shadow-sm`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className='ml-4 text-xl font-semibold text-gray-900'>
                  {feature.title}
                </h3>
              </div>
              <p className='leading-relaxed text-gray-600'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
