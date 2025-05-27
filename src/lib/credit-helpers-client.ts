import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function getUserCreditBalance(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_user_credit_balance', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error fetching credit balance:', error)
      return 0
    }

    return data || 0
  } catch (error) {
    console.error('Exception fetching credit balance:', error)
    return 0
  }
}

export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
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
  } catch (error) {
    console.error('Exception checking credits:', error)
    return false
  }
}

export async function spendCreditsForLearning(
  userId: string,
  exchangeId: string,
  amount = 5
): Promise<string | null> {
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
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Exception spending credits:', error)
    throw error
  }
}

export async function addCreditsForTeaching(
  userId: string,
  exchangeId: string,
  amount = 5
): Promise<string | null> {
  try {
    const description = 'Credits earned for teaching in an exchange'

    const { data, error } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_description: description,
      p_related_id: exchangeId
    })

    if (error) {
      console.error('Error adding credits:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Exception adding credits:', error)
    throw error
  }
}

export function formatCreditAmount(amount: number): string {
  return amount >= 0 ? `+${amount}` : `${amount}`
}
