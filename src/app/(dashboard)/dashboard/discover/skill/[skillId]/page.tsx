import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { hasEnoughCredits } from '@/lib/credit-helpers'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

import { DottedSeparator } from '@/components/ui/dotted-separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { ExchangeInitiationButtonWrapper } from '../../../skills/_components/exchange-initiation-button-wrapper'
import { CreditBasedLearningButtonWrapper } from '../../../learning/_components/credit-based-learning-button-wrapper'

const Page = async ({ params }: { params: Promise<{ skillId: string }> }) => {
  const { skillId } = await params

  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view skill details.</div>
  }

  // Check if user has enough credits for credit-based learning
  const hasCredits = await hasEnoughCredits(user.id, 5)

  // Get the skill details
  const { data: skill, error } = await supabase
    .from('skill_offerings')
    .select(
      `
      *,
      skill_categories(id, name),
      profiles!skill_offerings_user_id_fkey(id, username, avatar_url, bio)
    `
    )
    .eq('id', skillId)
    .single()

  if (error) {
    console.error('Error fetching skill:', error)
    return <div>Error loading skill details. Please try again later.</div>
  }

  if (!skill) {
    return <div className='p-4'>Skill not found.</div>
  }

  // Check if this is the user's own skill
  const isOwnSkill = skill.user_id === user.id

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center'>
        <Button variant='ghost' size='sm' asChild className='mr-2'>
          <Link href='/dashboard/discover'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Discover
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='text-2xl'>{skill.title}</CardTitle>
              <CardDescription>{skill.skill_categories?.name}</CardDescription>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='secondary'>
                {skill.experience_level || 'Not specified'}
              </Badge>
              <Badge variant='outline'>
                {skill.teaching_method || 'Online'}
              </Badge>
              <Badge variant='secondary'>
                {skill.difficulty_level || 'All levels'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage
                src={
                  skill.profiles?.avatar_url ||
                  '/placeholder.svg?height=48&width=48'
                }
                alt={skill.profiles?.username}
              />
              <AvatarFallback>
                {skill.profiles?.username?.substring(0, 2).toUpperCase() ||
                  '??'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-lg font-medium'>
                {skill.profiles?.username}
              </h3>
              <p className='text-muted-foreground text-sm'>Teacher</p>
            </div>
          </div>

          <DottedSeparator />

          <div>
            <h3 className='mb-2 font-medium'>Description</h3>
            <p className='text-muted-foreground'>{skill.description}</p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 font-medium'>Session Details</h3>
              <ul className='space-y-1 text-sm'>
                <li>
                  <span className='font-medium'>Duration:</span>{' '}
                  {skill.session_duration || 60} minutes
                </li>
                <li>
                  <span className='font-medium'>Max Students:</span>{' '}
                  {skill.max_students || 1}
                </li>
                <li>
                  <span className='font-medium'>Teaching Method:</span>{' '}
                  {skill.teaching_method === 'both'
                    ? 'Online & In-Person'
                    : skill.teaching_method === 'online' ||
                        !skill.teaching_method
                      ? 'Online Only'
                      : 'In-Person Only'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className='mb-2 font-medium'>Skill Level</h3>
              <ul className='space-y-1 text-sm'>
                <li>
                  <span className='font-medium'>
                    Teacher&apos;s Experience:
                  </span>{' '}
                  {skill.experience_level || 'Not specified'}
                </li>
                <li>
                  <span className='font-medium'>Suitable For:</span>{' '}
                  {skill.difficulty_level || 'All levels'}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-wrap gap-2'>
          {isOwnSkill ? (
            <Button variant='outline' asChild>
              <Link href={`/dashboard/skills/${skill.id}`}>
                Edit Your Skill
              </Link>
            </Button>
          ) : (
            <>
              <ExchangeInitiationButtonWrapper
                skillId={skill.id}
                teacherId={skill.user_id}
              />

              {hasCredits && (
                <CreditBasedLearningButtonWrapper
                  skillId={skill.id}
                  teacherId={skill.user_id}
                  skillTitle={skill.title}
                  teacherName={skill.profiles?.username}
                  variant='outline'
                />
              )}

              <Button variant='outline' asChild>
                <Link href={`/dashboard/profile/${skill.user_id}`}>
                  View Teacher Profile
                </Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default Page
