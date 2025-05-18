import { createClient } from '@/utils/supabase/server'
import { ExchangeInitiationButtonClient } from './exchange-initiation-button-client'

interface ExchangeInitiationButtonWrapperProps {
  skillId: string
  teacherId: string
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export const ExchangeInitiationButtonWrapper = async (
  props: ExchangeInitiationButtonWrapperProps
) => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get the user's skills for exchange
  const { data: userSkills } = await supabase
    .from('skill_offerings')
    .select('id, title, skill_categories(name)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Pass the user's skills to the client component
  return (
    <ExchangeInitiationButtonClient
      {...props}
      userSkills={userSkills || []}
      userId={user.id}
    />
  )
}
