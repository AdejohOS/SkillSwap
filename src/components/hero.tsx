import Image from 'next/image'
import { Button } from './ui/button'
export const Hero = () => {
  return (
    <section className='flex w-full flex-col-reverse items-center justify-between gap-10 pt-24 md:flex-row md:gap-16'>
      <div className='basis-1/2 space-y-3'>
        <h2 className='→ text-4xl font-bold lg:text-7xl'>
          <span className='bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent'>
            Teach
          </span>{' '}
          a Skill, Learn a{' '}
          <span className='bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text font-bold text-transparent'>
            Skill
          </span>
        </h2>
        <p>
          Learn something new by teaching what you already know — SkillSwap
          connects passionate learners and skilled teachers in a value-for-value
          exchange.
        </p>
        <Button>Start here</Button>
      </div>
      <div className='relative aspect-square basis-1/2'>
        <Image
          src='/images/hero.png'
          alt='hero-image'
          fill
          className='object-contain'
        />
      </div>
    </section>
  )
}
