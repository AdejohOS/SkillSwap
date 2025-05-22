'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  CheckCircle,
  Clock,
  Loader,
  ThumbsDown,
  ThumbsUp,
  XCircle
} from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface Swap {
  id: string
  status: string
  created_at: string | null
  updated_at: string | null
  scheduled_times: string[] | null
  agreement_details: string | null
  notes: string | null
  teacher_id: string
  learner_id: string
  teacher_rating: number | null
  learner_rating: number | null
  teacher_feedback: string | null
  learner_feedback: string | null
}
interface OtherUser {
  id: string
  username: string
}

interface UpdateData {
  status: string
  completed_at?: string | null
  teacher_feedback?: string | null
  learner_feedback?: string | null
}
interface SwapActionsProps {
  swap: Swap
  isTeacher: boolean
  otherUser: OtherUser
}

export const SwapActions = ({
  swap,
  isTeacher,
  otherUser
}: SwapActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function updateSwapStatus(status: string) {
    setIsLoading(true)

    try {
      const updateData: UpdateData = { status }

      // If marking as completed, set the completed_at timestamp
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('swaps')
        .update(updateData)
        .eq('id', swap.id)

      if (error) {
        throw error
      }

      toast.success(`You have ${status} the swap with ${otherUser.username}.`)

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function completeSwap() {
    setIsLoading(true)

    try {
      const updateData: any = {
        status: 'completed',
        completed_at: new Date().toISOString()
      }

      // Add feedback based on role
      if (isTeacher) {
        updateData.teacher_feedback = feedback
      } else {
        updateData.learner_feedback = feedback
      }

      const { error } = await supabase
        .from('swaps')
        .update(updateData)
        .eq('id', swap.id)

      if (error) {
        throw error
      }

      toast.success(`You have completed the swap with ${otherUser.username}.`)

      setIsCompletionDialogOpen(false)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Render different actions based on swap status and user role
  if (swap.status === 'pending') {
    if (isTeacher) {
      // Teacher can accept or reject pending swaps
      return (
        <div className='flex w-full flex-col space-y-2'>
          <div className='flex space-x-2'>
            <Button
              onClick={() => updateSwapStatus('accepted')}
              disabled={isLoading}
              className='flex-1'
            >
              {isLoading ? (
                <Loader className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <ThumbsUp className='mr-2 h-4 w-4' />
              )}
              Accept Request
            </Button>
            <Button
              onClick={() => updateSwapStatus('rejected')}
              variant='outline'
              disabled={isLoading}
              className='flex-1'
            >
              {isLoading ? (
                <Loader className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <ThumbsDown className='mr-2 h-4 w-4' />
              )}
              Decline
            </Button>
          </div>
          <p className='text-muted-foreground text-center text-xs'>
            {otherUser.username} is waiting for your response to their swap
            request.
          </p>
        </div>
      )
    } else {
      // Learner is waiting for teacher to accept
      return (
        <div className='flex w-full flex-col space-y-2'>
          <Button variant='outline' disabled className='w-full'>
            <Clock className='mr-2 h-4 w-4' />
            Awaiting Response
          </Button>
          <p className='text-muted-foreground text-center text-xs'>
            Your request has been sent to {otherUser.username}. Waiting for
            their response.
          </p>
        </div>
      )
    }
  }

  if (swap.status === 'accepted' || swap.status === 'in_progress') {
    // Both users can mark the swap as in progress or completed
    return (
      <div className='flex w-full flex-col space-y-2'>
        {swap.status === 'accepted' && (
          <Button
            onClick={() => updateSwapStatus('in_progress')}
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? (
              <Loader className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            Start Swap
          </Button>
        )}

        <AlertDialog
          open={isCompletionDialogOpen}
          onOpenChange={setIsCompletionDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant={swap.status === 'in_progress' ? 'default' : 'outline'}
              disabled={isLoading}
              className='w-full'
            >
              <CheckCircle className='mr-2 h-4 w-4' />
              Complete Swap
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete this swap?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the swap as completed. Please provide some
                feedback about your experience.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='feedback'>Feedback</Label>
                <Textarea
                  id='feedback'
                  placeholder={`Share your experience ${isTeacher ? 'teaching' : 'learning'} with ${otherUser.username}...`}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={e => {
                  e.preventDefault()
                  completeSwap()
                }}
              >
                {isLoading ? (
                  <Loader className='mr-2 h-4 w-4 animate-spin' />
                ) : null}
                Complete Swap
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant='outline'
          onClick={() => updateSwapStatus('cancelled')}
          disabled={isLoading}
          className='w-full'
        >
          <XCircle className='mr-2 h-4 w-4' />
          Cancel Swap
        </Button>
      </div>
    )
  }

  if (swap.status === 'completed') {
    return (
      <div className='flex w-full flex-col space-y-2'>
        <Button variant='outline' disabled className='w-full'>
          <CheckCircle className='mr-2 h-4 w-4' />
          Swap Completed
        </Button>
        <p className='text-muted-foreground text-center text-xs'>
          This swap has been completed. Thank you for participating!
        </p>
      </div>
    )
  }

  if (swap.status === 'rejected' || swap.status === 'cancelled') {
    return (
      <div className='flex w-full flex-col space-y-2'>
        <Button variant='outline' disabled className='w-full'>
          <XCircle className='mr-2 h-4 w-4' />
          Swap {swap.status === 'rejected' ? 'Rejected' : 'Cancelled'}
        </Button>
        <p className='text-muted-foreground text-center text-xs'>
          This swap has been{' '}
          {swap.status === 'rejected' ? 'rejected' : 'cancelled'}.
        </p>
      </div>
    )
  }

  return null
}
