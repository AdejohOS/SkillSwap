'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Loader } from 'lucide-react'

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
interface Request {
  id: string
  title: string
  skill_categories?: {
    name: string
  } | null
}
interface SkillSwapButtonProps {
  skillId: string
  teacherId: string
}

export const SkillSwapButton = ({
  skillId,
  teacherId
}: SkillSwapButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [myRequests, setMyRequests] = useState<Request[]>([])
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

  async function initiateSwap() {
    if (!selectedRequest) {
      toast.error('Please select a learning request.')
      return
    }

    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to request a swap')
      }

      // Check if a swap already exists
      const { data: existingSwaps } = await supabase
        .from('swaps')
        .select('id')
        .eq('offering_id', skillId)
        .eq('request_id', selectedRequest)
        .single()

      if (existingSwaps) {
        toast.error('You have already initiated a swap for this skill.')
        router.push(`/dashboard/swaps/${existingSwaps.id}`)
        setIsOpen(false)
        return
      }

      // Create the swap
      const { data: swap, error } = await supabase
        .from('swaps')
        .insert({
          offering_id: skillId,
          request_id: selectedRequest,
          teacher_id: teacherId,
          learner_id: userData.user.id,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      toast.success('Your swap request has been sent.')

      router.push(`/dashboard/swaps/${swap.id}`)
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
        <Button>Request Swap</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Request a Skill Swap</DialogTitle>
          <DialogDescription>
            Select one of your learning requests to initiate a swap for this
            skill.
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
            onClick={initiateSwap}
            disabled={isLoading || !selectedRequest}
          >
            {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Request Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
