import { createClient } from '@/utils/supabase/server'
import { Coins } from 'lucide-react'

interface CreditBalanceProps {
  userId: string
  showLabel?: boolean
  className?: string
}

export const CreditBalance = async ({
  userId,
  showLabel = true,
  className = ''
}: CreditBalanceProps) => {
  const supabase = await createClient()

  // Fetch the user's credit balance from the credits table
  const { data: creditData, error: creditError } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  // If the user doesn't have a credit record yet, create one with the default balance (5)
  let balance = 0
  if (creditError && creditError.code === 'PGRST116') {
    const { data: newCredit, error: insertError } = await supabase
      .from('credits')
      .insert({ user_id: userId, balance: 5 })
      .select('balance')
      .single()

    if (insertError) {
      console.error('Error creating credit record:', insertError)
    } else if (newCredit) {
      balance = newCredit.balance
    }
  } else if (creditError) {
    console.error('Error fetching credit balance:', creditError)
  } else {
    balance = creditData?.balance || 0
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Coins className='h-4 w-4 text-yellow-500' />
      <span className='font-medium'>{balance}</span>
      {showLabel && (
        <span className='text-muted-foreground text-sm'>credits</span>
      )}
    </div>
  )
}
