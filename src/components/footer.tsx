import Link from 'next/link'
import { Repeat } from 'lucide-react'

import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className='mt-auto bg-gray-50 px-4 py-12'>
      <div className='mx-auto max-w-7xl'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='mb-6 md:mb-0'>
            <h2 className='flex items-center gap-1 text-2xl font-bold'>
              <span className='rounded bg-gradient-to-r from-blue-600 to-purple-600 p-1 text-white hover:from-blue-700 hover:to-purple-700'>
                <Repeat className='size-4 text-white' />
              </span>
              SkillSwap
            </h2>
            <p className='mb-4 max-w-md text-gray-400'>
              The peer learning marketplace where knowledge flows freely. Learn
              any skill by teaching others or using our credit system.
            </p>
            <div className='mt-3 flex gap-5'>
              <Image
                alt='android'
                src='/images/android.png'
                width={100}
                height={100}
                className='rounded'
                loading='lazy'
              />
              <Image
                alt='android'
                src='/images/apple.png'
                width={100}
                height={100}
                className='rounded'
                loading='lazy'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-8'>
            <Link href='/about' className='text-gray-600 hover:text-cyan-700'>
              About
            </Link>
            <Link href='/faq' className='text-gray-600 hover:text-cyan-700'>
              FAQ
            </Link>
            <Link
              href='/legal/terms'
              className='text-gray-600 hover:text-cyan-700'
            >
              Terms & Conditions
            </Link>
            <Link
              href='/legal/privacy'
              className='text-gray-600 hover:text-cyan-700'
            >
              Privacy
            </Link>
            <Link href='/contact' className='text-gray-600 hover:text-cyan-700'>
              Contact
            </Link>
          </div>
        </div>
        <div className='mt-8 border-t border-gray-200 pt-8 text-center text-gray-500'>
          <p>
            &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
