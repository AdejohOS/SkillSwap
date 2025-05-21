'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

interface UserSkills {
  id: string
  title: string
  skill_categories: {
    name: string
  } | null
}

interface MyRequests {
  id: string
  title: string
  skill_categories: {
    name: string
  } | null
}

interface RequestSwapButtonProps {
  userId: string
}

export function RequestSwapButton({ userId }: RequestSwapButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userSkills, setUserSkills] = useState<UserSkills[]>([])
  const [myRequests, setMyRequests] = useState<MyRequests[]>([])
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedRequest, setSelectedRequest] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Fetch user's skills and my requests on component mount
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      // Fetch the user's active skills
      const { data: skills } = await supabase
        .from('skill_offerings')
        .select('id, title, skill_categories(name)')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (skills) {
        setUserSkills(skills)
      }

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
  }, [supabase, userId])

  async function initiateSwap() {
    if (!selectedSkill || !selectedRequest) {
      toast.error('Please select both a skill and a learning request.')
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
        .eq('offering_id', selectedSkill)
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
          offering_id: selectedSkill,
          request_id: selectedRequest,
          teacher_id: userId,
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
            Select a skill you want to learn and one of your learning requests
            to initiate a swap.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label htmlFor='skill' className='text-sm font-medium'>
              Skill to Learn
            </label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger id='skill'>
                <SelectValue placeholder='Select a skill' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Skills</SelectLabel>
                  {userSkills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.title} ({skill.skill_categories?.name})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
            disabled={isLoading || !selectedSkill || !selectedRequest}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Request Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
