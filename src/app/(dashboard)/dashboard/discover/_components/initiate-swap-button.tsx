'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface InitiateSwapButtonProps {
  offeringId: string
  requestId: string
  teacherId: string
  learnerId: string
}

export const InitiateSwapButton = ({
  offeringId,
  requestId,
  teacherId,
  learnerId
}: InitiateSwapButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function initiateSwap() {
    setIsLoading(true)

    try {
      // Check if a swap already exists
      const { data: existingSwaps } = await supabase
        .from('swaps')
        .select('id')
        .eq('offering_id', offeringId)
        .eq('request_id', requestId)
        .single()

      if (existingSwaps) {
        toast.error('You have already initiated a swap for this skill.')
        router.push(`/dashboard/swaps/${existingSwaps.id}`)
        return
      }

      // Create the swap
      const { data: swap, error } = await supabase
        .from('swaps')
        .insert({
          offering_id: offeringId,
          request_id: requestId,
          teacher_id: teacherId,
          learner_id: learnerId,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('Your swap request has been sent to the teacher.')

      router.push(`/dashboard/swaps/${swap.id}`)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={initiateSwap} disabled={isLoading}>
      {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
      Request Swap
    </Button>
  )
}
