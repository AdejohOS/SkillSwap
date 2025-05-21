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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

export const AllSkillsList = async () => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to browse skills.</div>
  }

  // Get all active skill offerings
  const { data: skills } = await supabase
    .from('skill_offerings')
    .select(
      `
      id, 
      title, 
      description, 
      experience_level, 
      teaching_method,
      user_id,
      skill_categories(id, name)
    `
    )
    .eq('is_active', true)
    .neq('user_id', user.id) // Don't show the user's own skills
    .order('created_at', { ascending: false })
    .limit(12)

  if (!skills || skills.length === 0) {
    return <div>No skills available at the moment. Check back later.</div>
  }

  // Get user profiles for the skills
  const teacherIds = skills.map(skill => skill.user_id)
  const { data: teacherProfiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', teacherIds)

  const teacherProfileMap = (teacherProfiles || []).reduce(
    (map, profile) => {
      map[profile.id] = profile
      return map
    },
    {} as Record<string, Profile>
  )

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {skills.map(skill => {
        const teacherProfile = teacherProfileMap[skill.user_id]
        return (
          <Card key={skill.id} className='flex flex-col'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0'>
              <div className='flex items-start space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={
                      teacherProfile?.avatar_url ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={teacherProfile?.username}
                  />
                  <AvatarFallback>
                    {teacherProfile?.username?.substring(0, 2).toUpperCase() ||
                      '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-base'>
                    {teacherProfile?.username}
                  </CardTitle>
                  <CardDescription>
                    {skill.skill_categories?.name}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex-1'>
              <h4 className='font-medium'>{skill.title}</h4>
              <p className='text-muted-foreground mt-2 line-clamp-3 text-sm'>
                {skill.description}
              </p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <Badge variant='secondary'>
                  {skill.experience_level || 'Not specified'}
                </Badge>
                {skill.teaching_method && (
                  <Badge variant='outline'>{skill.teaching_method}</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex justify-between border-t pt-4'>
              <Button variant='outline' asChild>
                <Link href={`/dashboard/profile/${skill.user_id}`}>
                  View Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/discover/skill/${skill.id}`}>
                  View Skill
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
