import { createClient } from '@/utils/supabase/server'

// Get a user's credit balance
export async function getUserCreditBalance(userId: string): Promise<number> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('get_user_credit_balance', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error getting credit balance:', error)
      return 0
    }

    return data || 0
  } catch (err) {
    console.error('Exception getting credit balance:', err)
    return 0
  }
}

// Check if a user has enough credits
export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('has_enough_credits', {
      p_user_id: userId,
      p_amount: amount
    })

    if (error) {
      console.error('Error checking credits:', error)
      return false
    }

    return data || false
  } catch (err) {
    console.error('Exception checking credits:', err)
    return false
  }
}

// Award credits to a user for completing an exchange
export async function awardCreditsForExchange(
  userId: string,
  exchangeId: string,
  isTeaching: boolean
): Promise<string | null> {
  const supabase = await createClient()

  try {
    const amount = isTeaching ? 5 : 1
    const description = isTeaching
      ? 'Credits earned for teaching in an exchange'
      : 'Credits earned for completing a learning exchange'

    const { data, error } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
      p_related_id: exchangeId
    })

    if (error) {
      console.error('Error awarding credits:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception awarding credits:', err)
    return null
  }
}

// Spend credits for a user to learn without teaching
export async function spendCreditsForLearning(
  userId: string,
  exchangeId: string,
  amount = 5
): Promise<string | null> {
  const supabase = await createClient()

  try {
    const description = 'Credits spent on learning without teaching'

    const { data, error } = await supabase.rpc('spend_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
      p_related_id: exchangeId
    })

    if (error) {
      console.error('Error spending credits:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception spending credits:', err)
    return null
  }
}

// Format credit amount with sign
export function formatCreditAmount(amount: number): string {
  return amount >= 0 ? `+${amount}` : `${amount}`
}
