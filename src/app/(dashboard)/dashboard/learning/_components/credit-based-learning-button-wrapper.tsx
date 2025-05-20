import { createClient } from '@/utils/supabase/server'
import { CreditBasedLearningButtonClient } from './credit-based-learning-button-client'

interface CreditBasedLearningButtonWrapperProps {
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

  // Get the user's credit balance directly from the credits table
  const { data } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', user.id)
    .single()

  const creditBalance = data?.balance || 0

  // Pass the credit balance to the client component
  return (
    <CreditBasedLearningButtonClient {...props} userCredits={creditBalance} />
  )
}
