'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Check, Loader, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

interface Update {
  status: string
  completed_at?: string | null
}
interface Exchange {
  id: string
  status: string
  user1_id: string
  user2_id: string
  created_by: string | null
}

interface ExchangeActionsProps {
  exchange: Exchange
  currentUserId: string
  otherUser: Profile
}

export const ExchangeActions = ({
  exchange,
  otherUser,
  currentUserId
}: ExchangeActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const isRecipient = exchange.created_by !== currentUserId

  async function updateExchangeStatus(newStatus: string) {
    setIsLoading(true)

    try {
      const updateData: Update = { status: newStatus }

      // If marking as completed, set the completed_at timestamp
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('exchanges')
        .update(updateData)
        .eq('id', exchange.id)

      if (error) {
        throw error
      }

      // If completing the exchange, also update any related swaps
      if (newStatus === 'completed') {
        // Get the related swaps
        const { data: swapData } = await supabase
          .from('exchanges')
          .select('swap1_id, swap2_id')
          .eq('id', exchange.id)
          .single()

        if (swapData) {
          // Update swap1 if it exists
          if (swapData.swap1_id) {
            await supabase
              .from('swaps')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString()
              })
              .eq('id', swapData.swap1_id)
          }

          // Update swap2 if it exists
          if (swapData.swap2_id) {
            await supabase
              .from('swaps')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString()
              })
              .eq('id', swapData.swap2_id)
          }
        }
      }

      // Create notification for the other user
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const { data: currentUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userData.user.id)
          .single()

        const notificationContent = getNotificationContent(
          newStatus,
          currentUser?.username || ' '
        )

        await supabase.from('notifications').insert({
          user_id: otherUser.id,
          type: `exchange_${newStatus}`,
          title: getNotificationTitle(newStatus),
          message: notificationContent,
          related_type: 'exchanges',
          related_id: exchange.id,
          is_read: false
        })

        toast.success(`Exchange has been ${newStatus}.`)

        await supabase.from('notifications').insert({
          user_id: otherUser.id,
          type: `exchange_${newStatus}`,
          title: getNotificationTitle(newStatus),
          message: notificationContent,
          related_type: 'exchanges',
          related_id: exchange.id,
          is_read: false
        })
      }

      toast.success(`Exchange has been ${newStatus}.`)

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to update exchange. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  function getNotificationTitle(status: string) {
    switch (status) {
      case 'accepted':
        return 'Exchange Request Accepted'
      case 'rejected':
        return 'Exchange Request Declined'
      case 'cancelled':
        return 'Exchange Cancelled'
      case 'completed':
        return 'Exchange Completed'
      default:
        return 'Exchange Update'
    }
  }

  function getNotificationContent(status: string, username: string) {
    switch (status) {
      case 'accepted':
        return `${username} has accepted your exchange request.`
      case 'rejected':
        return `${username} has declined your exchange request.`
      case 'cancelled':
        return `${username} has cancelled the exchange.`
      case 'completed':
        return `${username} has marked the exchange as completed.`
      default:
        return `${username} has updated the exchange status to ${status}.`
    }
  }

  // Determine which actions to show based on exchange status and user role
  const isPending = exchange.status === 'pending'
  const isActive =
    exchange.status === 'accepted' || exchange.status === 'in_progress'
  const isCompleted = exchange.status === 'completed'
  const isRejected =
    exchange.status === 'rejected' || exchange.status === 'cancelled'

  return (
    <div className='flex flex-wrap gap-2'>
      {isPending && isRecipient && (
        <>
          <Button
            onClick={() => updateExchangeStatus('accepted')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Check className='mr-2 h-4 w-4' />
            )}
            Accept Exchange
          </Button>
          <Button
            variant='outline'
            onClick={() => updateExchangeStatus('rejected')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <X className='mr-2 h-4 w-4' />
            )}
            Decline
          </Button>
        </>
      )}

      {isPending && !isRecipient && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='outline' disabled={isLoading}>
              Cancel Request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Exchange Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this exchange request? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep request</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => updateExchangeStatus('cancelled')}
              >
                Yes, cancel request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isActive && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isLoading}>
              {isLoading ? (
                <Loader className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Check className='mr-2 h-4 w-4' />
              )}
              Complete Exchange
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Exchange</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this exchange as completed? This
                will close the exchange and allow you to leave a review.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => updateExchangeStatus('completed')}
              >
                Yes, complete exchange
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isCompleted && (
        <Button variant='outline' disabled>
          Exchange Completed
        </Button>
      )}

      {isRejected && (
        <Button variant='outline' disabled>
          Exchange {exchange.status === 'rejected' ? 'Declined' : 'Cancelled'}
        </Button>
      )}
    </div>
  )
}
