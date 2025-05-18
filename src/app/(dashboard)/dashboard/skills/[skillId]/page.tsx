import React from 'react'
import { SkillForm } from '../_components/skill-form'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

const Page = async ({ params }: { params: Promise<{ skillId: string }> }) => {
  const { skillId } = await params

  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view this skill.</div>
  }

  const { data: skill, error } = await supabase
    .from('skill_offerings')
    .select('*')
    .eq('id', skillId)
    .eq('user_id', user.id)
    .single()

  if (error || !skill) {
    notFound()
  }

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Edit Skill</h2>
        <p className='text-muted-foreground'>Update your skill details.</p>
      </div>

      <SkillForm skill={skill} />
    </div>
  )
}

export default Page
