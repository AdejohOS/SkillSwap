import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Developer',
      content:
        'I learned Spanish by teaching Python programming. SkillSwap made it possible to exchange skills I never thought could be traded!',
      rating: 5,
      avatar: '/placeholder.svg?height=60&width=60'
    },
    {
      name: 'Marcus Johnson',
      role: 'Graphic Designer',
      content:
        'The credit system is brilliant. I earned credits teaching design and used them to learn guitar from an amazing teacher in Brazil.',
      rating: 5,
      avatar: '/placeholder.svg?height=60&width=60'
    },
    {
      name: 'Priya Patel',
      role: 'Marketing Manager',
      content:
        "Found my perfect language exchange partner through SkillSwap. We've been learning together for 6 months now!",
      rating: 5,
      avatar: '/placeholder.svg?height=60&width=60'
    }
  ]

  return (
    <section className='bg-gray-50 py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 sm:text-4xl'>
            What Our{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Community Says
            </span>
          </h2>
          <p className='mx-auto max-w-2xl text-xl text-gray-600'>
            Real stories from learners who&apos;ve transformed their skills
            through SkillSwap
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='rounded-xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'
            >
              <div className='mb-4 flex items-center'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='h-5 w-5 fill-current text-yellow-400'
                  />
                ))}
              </div>

              <div className='relative mb-6'>
                <Quote className='absolute -top-2 -left-2 h-8 w-8 text-blue-200' />
                <p className='pl-6 leading-relaxed text-gray-700'>
                  &apos;{testimonial.content}&apos;
                </p>
              </div>

              <div className='flex items-center'>
                <Image
                  src={testimonial.avatar || '/placeholder.svg'}
                  alt={testimonial.name}
                  className='mr-4 h-12 w-12 rounded-full'
                />
                <div>
                  <div className='font-semibold text-gray-900'>
                    {testimonial.name}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
