'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface InitiateSwapButtonProps {
  offeringId: string
  requestId: string
  teacherId: string
  learnerId: string
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

export function InitiateSwapButton({
  offeringId,
  requestId,
  teacherId,
  learnerId,
  variant = 'default',
  size = 'default',
  className = ''
}: InitiateSwapButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleInitiateExchange() {
    setIsLoading(true)

    try {
      // Create a credit-based exchange (one-way learning)
      const { data: swap, error: swapError } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: learnerId,
          skill_offering_id: offeringId,
          status: 'pending'
        })
        .select()
        .single()

      if (swapError) throw swapError

      // Create the exchange record (credit-based)
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: learnerId, // The learner initiates
          user2_id: teacherId, // The teacher receives
          swap1_id: swap.id,
          swap2_id: null, // No reciprocal swap for credit-based
          status: 'pending',
          created_by: learnerId,
          is_credit_based: true,
          credit_amount: 5 // Default credit amount
        })
        .select()
        .single()

      if (exchangeError) throw exchangeError

      // Link the request to the exchange
      const { error: requestUpdateError } = await supabase
        .from('skill_requests')
        .update({ exchange_id: exchange.id })
        .eq('id', requestId)

      if (requestUpdateError) throw requestUpdateError

      // Create a notification for the teacher
      await supabase.from('notifications').insert({
        user_id: teacherId,
        type: 'exchange_request',
        title: 'New Learning Request',
        message: 'Someone wants to learn from you!',
        related_type: 'exchanges',
        related_id: exchange.id,
        is_read: false
      })

      toast.success('Your learning request has been sent to the teacher.')

      router.refresh()
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to send request. Please try again.'
        )
      }
      console.error('Error initiating exchange:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleInitiateExchange}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader className='mr-2 h-4 w-4 animate-spin' /> Sending...
        </>
      ) : (
        <>
          <RefreshCw className='mr-2 h-4 w-4' /> Request Learning
        </>
      )}
    </Button>
  )
}
