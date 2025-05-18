import { Coins } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { Badge } from './ui/badge'

export const CreditSystem = () => {
  return (
    <section className='bg-gray-50 py-12 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 md:px-6'>
        <div className='mb-10 text-center'>
          <h2 className='text-3xl font-bold tracking-tighter text-cyan-900 sm:text-4xl'>
            Credit System
          </h2>
          <p className='text-muted-foreground mt-4 text-xl'>
            Our flexible credit system makes learning accessible to everyone
          </p>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          <Card>
            <CardHeader className='text-center'>
              <Coins className='text-primary mx-auto mb-4 h-12 w-12' />
              <CardTitle>Earn Credits</CardTitle>
              <CardDescription>
                Complete teaching sessions, refer friends, or participate in
                community activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    +5 credits
                  </Badge>
                  <span>Complete a teaching session</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    +2 credits
                  </Badge>
                  <span>Refer a new user</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    +1 credit
                  </Badge>
                  <span>Complete your profile</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='text-center'>
              <Coins className='text-primary mx-auto mb-4 h-12 w-12' />
              <CardTitle>Spend Credits</CardTitle>
              <CardDescription>
                Use your credits to learn from others without having to teach in
                return
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    -5 credits
                  </Badge>
                  <span>1-hour learning session</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    -12 credits
                  </Badge>
                  <span>3-hour learning package</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Badge variant='outline' className='bg-cyan-50'>
                    -20 credits
                  </Badge>
                  <span>5-hour learning package</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='text-center'>
              <Coins className='text-primary mx-auto mb-4 h-12 w-12' />
              <CardTitle>Benefits</CardTitle>
              <CardDescription>
                Our credit system creates a balanced ecosystem for all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='list-disc space-y-2 pl-5'>
                <li>New users can start learning immediately</li>
                <li>Encourages everyone to contribute over time</li>
                <li>Creates a sustainable community</li>
                <li>Rewards active teachers and contributors</li>
                <li>Flexible options for busy schedules</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
