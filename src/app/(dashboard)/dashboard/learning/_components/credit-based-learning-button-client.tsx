'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Coins, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface CreditBasedLearningButtonProps {
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
  userCredits?: number // Pass the user's credits from the parent component
}

export const CreditBasedLearningButtonClient = ({
  skillId,
  teacherId,
  variant = 'default',
  size = 'default',
  className = '',
  userCredits = 0 // Default to 0 if not provided
}: CreditBasedLearningButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // We'll use the userCredits prop instead of fetching them
  const hasEnoughCredits = userCredits >= 5

  async function initiateCreditsLearning() {
    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to use credits')
      }

      // Create the swap (you learning from them)
      const { data: swap, error: swapError } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: userData.user.id,
          skill_offering_id: skillId,
          status: 'pending',
          is_credit_based: true
        })
        .select()
        .single()

      if (swapError) {
        throw swapError
      }

      // Create the exchange record (one-way exchange)
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: userData.user.id,
          user2_id: teacherId,
          swap1_id: swap.id,
          status: 'pending',
          created_by: userData.user.id,
          is_credit_based: true
        })
        .select()
        .single()

      if (exchangeError) {
        throw exchangeError
      }

      // Spend credits using RPC
      const { data: transactionData, error: transactionError } =
        await supabase.rpc('spend_credits', {
          p_user_id: userData.user.id,
          p_amount: 5,
          p_description: 'Credits spent on learning without teaching',
          p_related_id: exchange.id
        })

      if (transactionError) {
        throw transactionError
      }

      // Create a notification for the other user
      await supabase.from('notifications').insert({
        user_id: teacherId,
        type: 'credit_learning_request',
        content: 'Someone wants to learn from you using credits!',
        related_id: exchange.id,
        is_read: false
      })

      toast.success('Learning request sent')

      setIsOpen(false)
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to process your request. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Coins className='mr-2 h-4 w-4' />
          Use Credits to Learn
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Learn Using Credits</DialogTitle>
          <DialogDescription>
            Spend 5 credits to learn this skill without having to teach in
            return.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : hasEnoughCredits ? (
            <div className='rounded-lg bg-green-50 p-4 text-green-800'>
              <p className='flex items-center font-medium'>
                <Coins className='mr-2 h-5 w-5' />
                You have enough credits for this learning request.
              </p>
              <p className='mt-2 text-sm'>
                5 credits will be deducted from your balance when you submit
                this request.
              </p>
            </div>
          ) : (
            <div className='rounded-lg bg-amber-50 p-4 text-amber-800'>
              <p className='flex items-center font-medium'>
                <Coins className='mr-2 h-5 w-5' />
                You don't have enough credits.
              </p>
              <p className='mt-2 text-sm'>
                You need 5 credits to make this request. Earn more credits by
                teaching others or consider a skill exchange instead.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={initiateCreditsLearning}
            disabled={isLoading || !hasEnoughCredits}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Spend 5 Credits to Learn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
