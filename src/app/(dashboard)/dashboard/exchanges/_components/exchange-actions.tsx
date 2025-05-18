'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Check, Loader2, X } from 'lucide-react'

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
      const { error: exchangeError } = await supabase
        .from('exchanges')
        .update({ status: newStatus })
        .eq('id', exchange.id)

      if (exchangeError) {
        throw exchangeError
      }

      // Create notification for the other user
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const { data: currentUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userData.user.id)
          .single()

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

        const notificationContent = getNotificationContent(
          newStatus,
          currentUser?.username ?? 'User'
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
      }

      toast.success(`Exchange has been ${newStatus}.`)

      router.refresh()
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to update exchange. Please try again.'
      )
    } finally {
      setIsLoading(false)
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
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
