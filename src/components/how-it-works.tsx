import {
  UserPlus,
  Search,
  MessageCircle,
  GraduationCap,
  ArrowRight,
  Coins,
  Users
} from 'lucide-react'

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description:
        'Sign up and showcase the skills you can teach. Tell us what you want to learn.',
      details: [
        'Add your expertise',
        'Set your availability',
        'Upload a profile photo'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      icon: Search,
      title: 'Discover & Match',
      description:
        'Browse thousands of skills or let our AI find perfect learning partners for you.',
      details: [
        'Smart matching algorithm',
        'Filter by location & time',
        'Browse skill categories'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      icon: MessageCircle,
      title: 'Connect & Plan',
      description:
        'Message your matches, discuss learning goals, and schedule your sessions.',
      details: [
        'Built-in messaging',
        'Calendar integration',
        'Set learning objectives'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      icon: GraduationCap,
      title: 'Learn & Earn',
      description:
        'Exchange knowledge, earn credits for teaching, and grow your skills together.',
      details: ['Reciprocal learning', 'Earn credits', 'Rate your experience'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    }
  ]

  return (
    <section
      id='how-it-works'
      className='bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-20 text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700'>
            <Users className='h-4 w-4' />
            How It Works
          </div>
          <h2 className='mb-6 text-4xl font-bold text-gray-900 sm:text-5xl'>
            Start Learning in{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              4 Simple Steps
            </span>
          </h2>
          <p className='mx-auto max-w-3xl text-xl leading-relaxed text-gray-600'>
            Join thousands of learners who are already exchanging skills and
            growing together. Our platform makes peer-to-peer learning simple,
            effective, and rewarding.
          </p>
        </div>

        <div className='relative'>
          <div className='absolute top-24 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200 lg:block'></div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
            {steps.map((step, index) => (
              <div key={index} className='group relative'>
                {index < steps.length - 1 && (
                  <div className='absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 transform lg:hidden'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white'>
                      <ArrowRight className='h-4 w-4 rotate-90 text-gray-400' />
                    </div>
                  </div>
                )}

                <div
                  className={`${step.bgColor} h-full rounded-2xl border border-white/50 p-8 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
                >
                  <div className='relative mb-6'>
                    <div
                      className={`h-16 w-16 ${step.iconBg} mx-auto mb-4 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                    >
                      <step.icon className='h-8 w-8 text-gray-700' />
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r ${step.color} flex items-center justify-center rounded-full text-sm font-bold text-white shadow-lg`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className='text-center'>
                    <h3 className='mb-3 text-xl font-bold text-gray-900'>
                      {step.title}
                    </h3>
                    <p className='mb-6 leading-relaxed text-gray-600'>
                      {step.description}
                    </p>

                    <ul className='space-y-2'>
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className='flex items-center justify-center text-sm text-gray-500'
                        >
                          <div className='mr-2 h-1.5 w-1.5 rounded-full bg-gray-400'></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className='absolute top-24 -right-3 z-20 hidden lg:block'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm'>
                      <ArrowRight className='h-3 w-3 text-gray-400' />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='mt-16 text-center'>
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white'>
            <div className='mb-4 flex items-center justify-center gap-2'>
              <Coins className='h-6 w-6' />
              <span className='text-lg font-semibold'>Credit System</span>
            </div>
            <h3 className='mb-3 text-2xl font-bold'>
              Can&apos;t find a skill exchange?
            </h3>
            <p className='mx-auto mb-6 max-w-2xl text-blue-100'>
              Use our credit system! Earn credits by teaching others, then spend
              them to learn any skill without needing to offer something in
              return.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <div className='flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2'>
                <span className='text-sm'>Teach a skill</span>
                <ArrowRight className='h-4 w-4' />
                <span className='text-sm font-semibold'>Earn 5 credits</span>
              </div>
              <div className='flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2'>
                <span className='text-sm'>Spend 5 credits</span>
                <ArrowRight className='h-4 w-4' />
                <span className='text-sm font-semibold'>Learn any skill</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
