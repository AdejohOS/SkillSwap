import { getUserCreditBalance } from '@/lib/credit-helpers'
import { CreditBasedLearningButtonClient } from './credit-based-learning-button-client'
import { createClient } from '@/utils/supabase/server'

interface CreditBasedLearningButtonWrapperProps {
  skillId: string
  teacherId: string
  skillTitle?: string
  teacherName?: string
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  creditCost?: number
}

export const CreditBasedLearningButtonWrapper = async (
  props: CreditBasedLearningButtonWrapperProps
) => {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get skill details for better UX
  const { data: skill } = await supabase
    .from('skill_offerings')
    .select(
      `
      title,
      profiles!skill_offerings_user_id_fkey(username)
    `
    )
    .eq('id', props.skillId)
    .single()

  // Get user's credit balance
  const creditBalance = await getUserCreditBalance(user.id)

  // Pass all necessary data to the client component
  return (
    <CreditBasedLearningButtonClient
      {...props}
      userId={user.id}
      userCredits={creditBalance}
      skillTitle={props.skillTitle || skill?.title || 'this skill'}
      teacherName={
        props.teacherName || skill?.profiles?.username || 'this teacher'
      }
    />
  )
}
