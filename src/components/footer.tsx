import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { Button } from './ui/button'

import Image from 'next/image'
import { DottedSeparator } from './ui/dotted-separator'
import { LinksAccordion } from './links-accordion'

export const Footer = () => {
  return (
    <footer className='bg-neutral-50'>
      <div className='mx-auto max-w-7xl px-4 py-20'>
        <div className='grid gap-5 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold md:text-3xl'>
              <Link href='/'>
                Skill<span className='text-teal-600'>Swap</span>
              </Link>
            </h1>
            <p className='max-w-[300px]'>
              FeatherMart is a poultry store where you can get the best poultry
              product and all, Get your daily needs from our store.
            </p>
            <div className='flex items-center gap-3'>
              <Link
                href='/'
                className='relative aspect-video w-[130px] overflow-hidden rounded-sm'
              >
                <Image
                  alt='playStore'
                  src='/images/android.png'
                  fill
                  className='object-contain'
                />
              </Link>{' '}
              <Link
                href='/'
                className='relative aspect-video w-[130px] overflow-hidden rounded-sm'
              >
                <Image
                  alt='playStore'
                  src='/images/apple.png'
                  fill
                  className='object-contain'
                />
              </Link>
            </div>
          </div>

          <div className='hidden lg:block'>
            <h2 className='text-2xl font-semibold'>Category</h2>
            <DottedSeparator className='my-4' />
            <div className='space-y-3'>
              <p>
                <Link href='/'>Food</Link>
              </p>
              <p>
                <Link href='/'>Broilers</Link>
              </p>
              <p>
                <Link href='/'>Layers</Link>
              </p>
              <p>
                <Link href='/'>6 Months</Link>
              </p>
              <p>
                <Link href='/'>Largest</Link>
              </p>
            </div>
          </div>
          <div className='hidden lg:block'>
            <h2 className='text-2xl font-semibold'>Company</h2>
            <DottedSeparator className='my-4' />
            <div className='space-y-3'>
              <p>
                <Link href='/'>About us</Link>
              </p>
              <p>
                <Link href='/'>Delivery</Link>
              </p>
              <p>
                <Link href='/'>Legal Notice</Link>
              </p>
              <p>
                <Link href='/'>Terms & Conditions</Link>
              </p>
              <p>
                <Link href='/'>Contact us</Link>
              </p>
            </div>
          </div>
          <div className='hidden lg:block'>
            <h2 className='text-2xl font-semibold'>Account</h2>
            <DottedSeparator className='my-4' />
            <div className='space-y-3'>
              <p>
                <Link href='/'>Sign In</Link>
              </p>
              <p>
                <Link href='/'>View Cart</Link>
              </p>
              <p>
                <Link href='/'>Return Policy</Link>
              </p>
              <p>
                <Link href='/vendor-market'>Sell on FeatherMart</Link>
              </p>
              <p>
                <Link href='/'>Payments</Link>
              </p>
            </div>
          </div>

          <div className='hidden lg:block'>
            <h2 className='text-2xl font-semibold'>Contact</h2>
            <DottedSeparator className='my-4' />
            <div className='space-y-3'>
              <p className='flex gap-3'>
                <MapPin className='size-5 shrink-0 text-teal-600' />
                265 Jamison Auth, Kenturkey, BA, USA
              </p>
              <p className='flex gap-3'>
                <FaWhatsapp className='size-5 shrink-0 text-teal-600' />
                +234 706 3494 393
              </p>
              <p className='flex gap-3'>
                <Mail className='size-5 shrink-0 text-teal-600' />
                sales@feathermart.com
              </p>

              <p className='flex gap-3'>
                <Button size='icon' variant='secondary'>
                  <FaFacebook />
                </Button>
                <Button size='icon' variant='secondary'>
                  <FaInstagram />
                </Button>
                <Button size='icon' variant='secondary'>
                  <FaTwitter />
                </Button>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-7 lg:hidden'>
          <LinksAccordion />
        </div>
      </div>
      <div className='bg-neutral-100'>
        <div className='mx-auto flex max-w-7xl items-center justify-center p-4'>
          <p className='text-sm'>
            Copyright &copy; <span className='text-teal-600'>SkillSwap</span>{' '}
            all rights reserved. Powered by{' '}
            <Link className='text-teal-600' href='/'>
              AOS
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
