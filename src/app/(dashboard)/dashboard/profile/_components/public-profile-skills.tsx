import { cookies } from 'next/headers'
import Link from 'next/link'

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

interface PublicProfileSkillsProps {
  userId: string
}

export const PublicProfileSkills = async ({
  userId
}: PublicProfileSkillsProps) => {
  const supabase = await createClient()

  // Fetch the user's active skills
  const { data: skills } = await supabase
    .from('skill_offerings')
    .select(
      `
      id, 
      title, 
      description, 
      experience_level, 
      teaching_method,
      skill_categories(id, name)
    `
    )
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!skills || skills.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <h3 className='font-medium'>No active skills</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          This user hasn't added any active skills yet.
        </p>
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {skills.map(skill => (
        <Card key={skill.id} className='flex flex-col'>
          <CardHeader>
            <CardTitle className='line-clamp-1'>{skill.title}</CardTitle>
            <CardDescription>{skill.skill_categories?.name}</CardDescription>
          </CardHeader>
          <CardContent className='flex-1'>
            <p className='text-muted-foreground line-clamp-3 text-sm'>
              {skill.description}
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Badge variant='secondary'>{skill.experience_level}</Badge>
              <Badge variant='secondary'>{skill.teaching_method}</Badge>
            </div>
          </CardContent>
          <CardFooter className='border-t pt-4'>
            <Button className='w-full' asChild>
              <Link href={`/dashboard/skills/${skill.id}/request`}>
                Request Swap
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
