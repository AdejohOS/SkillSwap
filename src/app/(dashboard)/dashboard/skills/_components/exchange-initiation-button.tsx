'use client'

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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface ExchangeInitiationButtonProps {
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
}

export function ExchangeInitiationButton({
  skillId,
  teacherId,
  variant = 'default',
  size = 'default',
  className = ''
}: ExchangeInitiationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [mySkills, setMySkills] = useState<any[]>([])
  const [hasLoadedSkills, setHasLoadedSkills] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Load the user's skills when the dialog opens
  async function loadMySkills() {
    if (hasLoadedSkills) return

    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to initiate an exchange')
      }

      const { data: skills, error } = await supabase
        .from('skill_offerings')
        .select('id, title')
        .eq('user_id', userData.user.id)
        .eq('is_active', true)
        .order('title')

      if (error) {
        throw error
      }

      setMySkills(skills || [])
      setHasLoadedSkills(true)
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to load your skills. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function initiateExchange() {
    if (!selectedSkill) {
      toast.error('Please select one of your skills to offer in exchange.')
      return
    }

    setIsLoading(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        throw new Error('You must be logged in to initiate an exchange')
      }

      // Create the first swap (you learning from them)
      const { data: swap1, error: swap1Error } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: userData.user.id,
          skill_offering_id: skillId,
          status: 'pending'
        })
        .select()
        .single()

      if (swap1Error) {
        throw swap1Error
      }

      // Create the second swap (you teaching them)
      const { data: swap2, error: swap2Error } = await supabase
        .from('swaps')
        .insert({
          teacher_id: userData.user.id,
          learner_id: teacherId,
          skill_offering_id: selectedSkill,
          status: 'pending'
        })
        .select()
        .single()

      if (swap2Error) {
        throw swap2Error
      }

      // Create the exchange record
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: userData.user.id,
          user2_id: teacherId,
          swap1_id: swap1.id,
          swap2_id: swap2.id,
          status: 'pending',
          created_by: userData.user.id
        })
        .select()
        .single()

      if (exchangeError) {
        throw exchangeError
      }

      // Create a notification for the other user
      await supabase.from('notifications').insert({
        user_id: teacherId,
        type: 'exchange_request',
        content: 'Someone has proposed a skill exchange with you!',
        related_id: exchange.id,
        is_read: false
      })

      toast.success(
        "Your exchange request has been sent. You'll be notified when they respond."
      )

      setIsOpen(false)
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to initiate exchange. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open)
        if (open) loadMySkills()
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <ArrowLeftRight className='mr-2 h-4 w-4' />
          Initiate Exchange
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate Skill Exchange</DialogTitle>
          <DialogDescription>
            Select one of your skills to offer in exchange for learning this
            skill.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='skill'>Select a skill you can teach:</Label>
            <Select
              value={selectedSkill}
              onValueChange={setSelectedSkill}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select one of your skills' />
              </SelectTrigger>
              <SelectContent>
                {mySkills.length === 0 ? (
                  <SelectItem value='none' disabled>
                    {isLoading ? 'Loading skills...' : 'No active skills found'}
                  </SelectItem>
                ) : (
                  mySkills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {mySkills.length === 0 && !isLoading && (
            <p className='text-sm text-amber-600'>
              You don't have any active skills to offer. Please add a skill
              first.
            </p>
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
            onClick={initiateExchange}
            disabled={isLoading || !selectedSkill}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Initiate Exchange
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
