import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ArrowRight, BookOpen, Code, Music, Palette } from 'lucide-react'
import Link from 'next/link'
export const Hero = () => {
  return (
    <section className='bg-gray-50 pt-30 pb-12 md:pt-30 md:pb-24'>
      <div className='mx-auto max-w-7xl px-4 md:px-6'>
        <div className='grid items-center gap-6 lg:grid-cols-2 lg:gap-12'>
          <div className='space-y-4'>
            <h1 className='text-3xl font-bold tracking-tighter text-cyan-900 sm:text-4xl md:text-5xl'>
              Exchange <span className='text-orange-600'>skills,</span>{' '}
              <span className='text-green-600'>grow</span> together
            </h1>
            <p className='text-muted-foreground md:text-xl'>
              Find partners who have skills you want to learn, and teach them
              what you know best.
            </p>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link href='/find-partners'>
                <Button size='lg' className='w-full sm:w-auto'>
                  Find Exchange Partners
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link href='#how-it-works'>
                <Button
                  variant='outline'
                  size='lg'
                  className='w-full sm:w-auto'
                >
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Card className=''>
              <CardHeader className='p-4'>
                <Code className='mb-2 h-8 w-8 text-cyan-600' />
                <CardTitle className='text-lg text-cyan-900'>
                  Programming
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <p className='text-muted-foreground text-sm'>
                  Web development, mobile apps, data science
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <Palette className='mb-2 h-8 w-8 text-cyan-600' />
                <CardTitle className='text-lg text-cyan-900'>Design</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <p className='text-muted-foreground text-sm'>
                  UI/UX, graphic design, illustration
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <Music className='mb-2 h-8 w-8 text-cyan-600' />
                <CardTitle className='text-lg text-cyan-900'>Music</CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <p className='text-muted-foreground text-sm'>
                  Instruments, production, theory
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='p-4'>
                <BookOpen className='mb-2 h-8 w-8 text-cyan-600' />
                <CardTitle className='text-lg text-cyan-900'>
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <p className='text-muted-foreground text-sm'>
                  English, Spanish, Japanese, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
