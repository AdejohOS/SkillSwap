import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export const HowItWorks = () => {
  return (
    <section className='py-12 md:py-24' id='how-it-works'>
      <div className='mx-auto max-w-7xl px-4 md:px-6'>
        <div className='mb-10 text-center'>
          <h2 className='text-3xl font-bold tracking-tighter text-cyan-900 sm:text-4xl md:text-5xl'>
            How It Works
          </h2>
          <p className='text-muted-foreground mt-4 text-xl'>
            Simple steps to start exchanging skills
          </p>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <div className='bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                1
              </div>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>
                Add skills you have and skills you want to learn
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className='bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                2
              </div>
              <CardTitle>Find Matches</CardTitle>
              <CardDescription>
                Our algorithm finds people with complementary skills
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className='bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                3
              </div>
              <CardTitle>Propose Exchanges</CardTitle>
              <CardDescription>
                Connect and arrange skill exchange sessions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
