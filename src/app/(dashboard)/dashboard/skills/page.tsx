import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { SkillsList } from './_components/skill-list'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SkillsEmptyState } from './_components/skill-empty-state'

const Page = async () => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch the user's skills with category information
  const { data: skills, error } = await supabase
    .from('skill_offerings')
    .select(
      `
      *,
      skill_categories (
        id,
        name
      ),
      profiles (
        id,
        username,
        avatar_url
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching skills:', error)
    return <div>Error loading skills. Please try again later.</div>
  }

  // For each skill, get exchange statistics
  const skillsWithExchanges = await Promise.all(
    skills.map(async skill => {
      const { data: exchangeData, error: exchangeError } = await supabase.rpc(
        'get_exchanges_by_skill_offering',
        {
          skill_id: skill.id
        }
      )

      if (exchangeError) {
        console.error('Error fetching exchanges:', exchangeError)
        return {
          ...skill,
          exchange_count: 0,
          active_exchanges: 0,
          pending_exchanges: 0
        }
      }

      const activeExchanges =
        exchangeData?.filter(ex =>
          ['accepted', 'in_progress'].includes(ex.exchange_status)
        ) || []

      const pendingExchanges =
        exchangeData?.filter(ex => ex.exchange_status === 'pending') || []

      return {
        ...skill,
        exchange_count: exchangeData?.length || 0,
        active_exchanges: activeExchanges.length,
        pending_exchanges: pendingExchanges.length
      }
    })
  )

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            My Teaching Skills
          </h1>
          <p className='text-muted-foreground'>
            Manage the skills you can teach to others.
          </p>
        </div>
        <Button asChild>
          <Link href='/dashboard/skills/new'>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add Skill
          </Link>
        </Button>
      </div>

      {skillsWithExchanges.length > 0 ? (
        <SkillsList skills={skillsWithExchanges} userId={user.id} />
      ) : (
        <SkillsEmptyState />
      )}
    </div>
  )
}

export default Page
