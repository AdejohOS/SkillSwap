'use client'

import { useEffect } from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ArrowLeftRight, Loader2 } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface MyRequest {
  id: string
  title: string
  skill_categories: {
    name: string
  } | null
}

interface SkillSwapButtonProps {
  skillId: string
  teacherId: string
}

export function SkillSwapButton({ skillId, teacherId }: SkillSwapButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Fetch user's learning requests on component mount
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      // Fetch my active learning requests
      const { data: requests } = await supabase
        .from('skill_requests')
        .select('id, title, skill_categories(name)')
        .eq('user_id', userData.user.id)
        .eq('is_active', true)

      if (requests) {
        setMyRequests(requests)
      }
    }

    fetchData()
  }, [supabase])

  async function initiateExchange() {
    if (!selectedRequest) {
      toast.error('Please select a learning request.')
      return
    }

    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to request an exchange')
      }

      // Create my swap (I'm the learner)
      const { data: mySwap, error: mySwapError } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: userData.user.id,
          skill_offering_id: skillId,
          skill_request_id: selectedRequest,
          status: 'pending'
        })
        .select('id')
        .single()

      if (mySwapError) throw mySwapError

      // Get info about my skill to potentially match
      const { data: mySkills } = await supabase
        .from('skill_offerings')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('is_active', true)
        .limit(1)

      // Get info about their learning requests
      const { data: theirRequests } = await supabase
        .from('skill_requests')
        .select('id')
        .eq('user_id', teacherId)
        .eq('is_active', true)
        .limit(1)

      // If we have a potential match, create a reciprocal swap
      let theirSwap = null
      if (
        mySkills &&
        mySkills.length > 0 &&
        theirRequests &&
        theirRequests.length > 0
      ) {
        const { data: swap, error: swapError } = await supabase
          .from('swaps')
          .insert({
            teacher_id: userData.user.id,
            learner_id: teacherId,
            skill_offering_id: mySkills[0].id,
            skill_request_id: theirRequests[0].id,
            status: 'pending'
          })
          .select('id')
          .single()

        if (!swapError) {
          theirSwap = swap
        }
      }

      // Create the exchange
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: userData.user.id,
          user2_id: teacherId,
          swap1_id: mySwap.id,
          swap2_id: theirSwap?.id || null,
          status: 'pending',
          created_by: userData.user.id
        })
        .select('id')
        .single()

      if (exchangeError) throw exchangeError

      // Create notification for the teacher
      await supabase.from('notifications').insert({
        user_id: teacherId,
        type: 'exchange_request',
        message: 'You have a new exchange request!',
        related_id: exchange.id,
        is_read: false
      })

      toast.success('Your exchange request has been sent.')

      router.push(`/dashboard/exchanges/${exchange.id}`)
      router.refresh()
      setIsOpen(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight className='mr-2 h-4 w-4' />
          Propose Exchange
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Propose a Skill Exchange</DialogTitle>
          <DialogDescription>
            Select one of your learning requests to initiate an exchange.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label htmlFor='request' className='text-sm font-medium'>
              Your Learning Request
            </label>
            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
              <SelectTrigger id='request'>
                <SelectValue placeholder='Select a learning request' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Requests</SelectLabel>
                  {myRequests.map(request => (
                    <SelectItem key={request.id} value={request.id}>
                      {request.title} ({request.skill_categories?.name})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {myRequests.length === 0 && (
              <p className='text-muted-foreground text-xs'>
                You don&apos;t have any active learning requests. Please create
                one first.
              </p>
            )}
          </div>
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
            onClick={initiateExchange}
            disabled={isLoading || !selectedRequest}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Propose Exchange
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
