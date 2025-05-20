import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export const ReciprocalMatchesEmptyState = () => {
  return (
    <Card className='text-center'>
      <CardHeader>
        <CardTitle className='text-xl'>
          No potential exchange partners found
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center justify-center space-y-4 py-8'>
          <div className='bg-muted rounded-full p-6'>
            <ArrowLeftRight className='text-muted-foreground h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <p className='text-muted-foreground'>
              We couldn&apos;t find any users who both have skills you want to
              learn and want to learn skills you can teach.
            </p>
            <p className='text-muted-foreground'>
              Try adding more skills you can teach or more learning requests to
              increase your chances of finding a match.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-center space-x-4'>
        <Button asChild variant='outline'>
          <Link href='/dashboard/skills/new'>Add a Skill</Link>
        </Button>
        <Button asChild>
          <Link href='/dashboard/learning/new'>Add Learning Request</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
