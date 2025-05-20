import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface ProfileLearningProps {
  userId: string
}

export const ProfileLearning = async ({ userId }: ProfileLearningProps) => {
  const supabase = await createClient()

  // Fetch the user's learning requests
  const { data: requests } = await supabase
    .from('skill_requests')
    .select(
      `
      id, 
      title, 
      description, 
      current_skill_level, 
      preferred_learning_method,
      is_active,
      skill_categories(id, name),
      swaps(id)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!requests || requests.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <h3 className='font-medium'>No learning requests added yet</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Add skills that you want to learn from others.
        </p>
        <Button className='mt-4' asChild>
          <Link href='/dashboard/learning/new'>Add Your First Request</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {requests.map(request => {
        const isMatched = request.swaps && request.swaps.length > 0

        return (
          <Card key={request.id} className='flex flex-col'>
            <CardHeader>
              <CardTitle className='line-clamp-1'>{request.title}</CardTitle>
              <CardDescription>
                {request.skill_categories?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1'>
              <p className='text-muted-foreground line-clamp-3 text-sm'>
                {request.description}
              </p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <Badge variant={isMatched ? 'secondary' : 'default'}>
                  {isMatched ? 'Matched' : 'Looking for Teacher'}
                </Badge>
                <Badge variant='outline'>{request.current_skill_level}</Badge>
                <Badge variant='outline'>
                  {request.preferred_learning_method}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className='border-t pt-4'>
              <Button
                variant='ghost'
                size='sm'
                className='ml-auto gap-1'
                asChild
              >
                <Link href={`/dashboard/learning/${request.id}`}>
                  View Details
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
