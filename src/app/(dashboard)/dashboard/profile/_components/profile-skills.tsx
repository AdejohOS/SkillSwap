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

interface ProfileSkillsProps {
  userId: string
}

export const ProfileSkills = async ({ userId }: ProfileSkillsProps) => {
  const supabase = await createClient()

  // Fetch the user's skills
  const { data: skills } = await supabase
    .from('skill_offerings')
    .select(
      `
      id, 
      title, 
      description, 
      experience_level, 
      teaching_method,
      is_active,
      skill_categories(id, name)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!skills || skills.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <h3 className='font-medium'>No skills added yet</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Add skills that you can teach to others.
        </p>
        <Button className='mt-4' asChild>
          <Link href='/dashboard/skills/new'>Add Your First Skill</Link>
        </Button>
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
              <Badge variant={skill.is_active ? 'default' : 'outline'}>
                {skill.is_active ? 'Active' : 'Draft'}
              </Badge>
              <Badge variant='secondary'>{skill.experience_level}</Badge>
              <Badge variant='secondary'>{skill.teaching_method}</Badge>
            </div>
          </CardContent>
          <CardFooter className='border-t pt-4'>
            <Button variant='ghost' size='sm' className='ml-auto gap-1' asChild>
              <Link href={`/dashboard/skills/${skill.id}`}>
                View Details
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
