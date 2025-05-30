'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Coins, Loader } from 'lucide-react'

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
import { spendCreditsForLearning } from '@/lib/credit-helpers-client'

interface CreditBasedLearningButtonClientProps {
  skillId: string
  teacherId: string
  skillTitle: string
  teacherName: string
  userCredits: number
  userId: string
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

export const CreditBasedLearningButtonClient = ({
  skillId,
  teacherId,
  skillTitle,
  teacherName,
  userCredits: initialCredits,
  userId,
  variant = 'default',
  size = 'default',
  className = '',
  creditCost = 5
}: CreditBasedLearningButtonClientProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userCredits, setUserCredits] = useState(initialCredits)
  const router = useRouter()

  const hasEnoughCredits = userCredits >= creditCost
  const supabase = createClient()

  async function initiateCreditsLearning() {
    if (!hasEnoughCredits) {
      toast.error(
        `You need ${creditCost} credits but only have ${userCredits}.`
      )
      return
    }

    setIsLoading(true)

    try {
      // Create the swap (you learning from them)
      const { data: swap, error: swapError } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: userId,
          skill_offering_id: skillId,
          status: 'pending',
          is_credit_based: true
        })
        .select()
        .single()

      if (swapError) {
        console.error('Swap creation error:', swapError)

        throw new Error('Failed to create learning request')
      }

      // Create the exchange record (one-way exchange)
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: userId,
          user2_id: teacherId,
          swap1_id: swap.id,
          status: 'pending',
          created_by: userId,
          is_credit_based: true,
          credit_amount: creditCost
        })
        .select()
        .single()

      if (exchangeError) {
        console.error('Exchange creation error:', exchangeError)
        await supabase.from('swaps').delete().eq('id', swap.id)
        throw new Error('Failed to create exchange')
      }

      // Spend credits using the helper function
      try {
        await spendCreditsForLearning(userId, exchange.id, creditCost)
        // Update local credit balance
        setUserCredits(userCredits - creditCost)
      } catch (creditError) {
        console.error('Credit spending error:', creditError)
        // If credit spending fails, clean up the exchange and swap
        await supabase.from('exchanges').delete().eq('id', exchange.id)
        await supabase.from('swaps').delete().eq('id', swap.id)
        throw new Error('Failed to spend credits for learning')
      }

      // Create a notification for the teacher
      await supabase.from('notifications').insert({
        user_id: teacherId,
        type: 'credit_learning_request',
        message: `Someone wants to learn ${skillTitle} from you using ${creditCost} credits!`,
        related_id: exchange.id,
        is_read: false
      })

      toast.success(
        `You've spent ${creditCost} credits to request learning ${skillTitle}. ${teacherName} will be notified.`
      )

      setIsOpen(false)
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: unknown) {
      console.error('Credit learning error:', error)
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to process your request. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Coins className='mr-2 h-4 w-4' />
          Use {creditCost} Credits
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Learn Using Credits</DialogTitle>
          <DialogDescription>
            Spend {creditCost} credits to learn &apos;{skillTitle}&apos; from{' '}
            {teacherName} without having to teach in return.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
            <span className='font-medium'>Your current balance:</span>
            <span className='flex items-center text-lg font-bold'>
              <Coins className='mr-1 h-5 w-5 text-amber-500' />
              {userCredits}
            </span>
          </div>

          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loader className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : hasEnoughCredits ? (
            <div className='rounded-lg bg-green-50 p-4 text-green-800'>
              <p className='flex items-center font-medium'>
                <Coins className='mr-2 h-5 w-5' />
                You have enough credits for this learning request.
              </p>
              <p className='mt-2 text-sm'>
                {creditCost} credits will be deducted from your balance.
                You&apos;ll have {userCredits - creditCost} credits remaining.
              </p>
            </div>
          ) : (
            <div className='rounded-lg bg-amber-50 p-4 text-amber-800'>
              <p className='flex items-center font-medium'>
                <Coins className='mr-2 h-5 w-5' />
                You don&apos;t have enough credits.
              </p>
              <p className='mt-2 text-sm'>
                You need {creditCost} credits but only have {userCredits}. Earn
                more credits by teaching others or consider a skill exchange
                instead.
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
            {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Spend {creditCost} Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
