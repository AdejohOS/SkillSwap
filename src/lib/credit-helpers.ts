import { createClient } from '@/utils/supabase/server'

// Update the getUserCreditBalance function to use a direct query instead of RPC
export async function getUserCreditBalance(userId: string): Promise<number> {
  const supabase = await createClient()

  // Query the credits table directly instead of using RPC
  const { data, error } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error getting credit balance:', error)
    return 0
  }

  return data?.balance || 0
}

// Update the hasEnoughCredits function to use the direct query approach
export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const balance = await getUserCreditBalance(userId)
  return balance >= amount
}

// Spend credits for learning
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
