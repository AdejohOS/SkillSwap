'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
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

interface SkillOffering {
  id: string
  title: string
}

interface SkillRequest {
  id: string
  title: string
}

interface SelectionDialogProps {
  userId: string
  otherUserId: string
  otherUserName: string
  mySkillOfferings: SkillOffering[]
  theirSkillOfferings: SkillOffering[]
  mySkillRequests?: SkillRequest[]
  theirSkillRequests?: SkillRequest[]

  // These should be undefined for this interface
  partnerId?: undefined
  mySkillId?: undefined
  theirSkillId?: undefined

  buttonText?: string
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

interface DirectSkillsProps {
  userId: string
  partnerId: string
  mySkillId: string
  theirSkillId: string

  // These should be undefined for this interface
  otherUserId?: undefined
  otherUserName?: string
  mySkillOfferings?: undefined
  theirSkillOfferings?: undefined
  mySkillRequests?: undefined
  theirSkillRequests?: undefined

  buttonText?: string
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

// Combined type that can be either interface
type InitiateExchangeButtonProps = SelectionDialogProps | DirectSkillsProps

export const InitiateExchangeButton = (props: InitiateExchangeButtonProps) => {
  const {
    userId,
    buttonText = 'Initiate Exchange',
    variant = 'default',
    size = 'default',
    className
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMySkillId, setSelectedMySkillId] = useState('')
  const [selectedTheirSkillId, setSelectedTheirSkillId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Determine if we're using the direct skills interface
  const isDirectSkills =
    'partnerId' in props && 'mySkillId' in props && 'theirSkillId' in props

  // Get the partner ID (either from partnerId or otherUserId)
  const partnerId = isDirectSkills ? props.partnerId : props.otherUserId

  // Get the partner name
  const partnerName = isDirectSkills
    ? props.otherUserName || 'partner'
    : props.otherUserName

  async function handleInitiateExchange() {
    // For direct skills, we don't need to check for selection
    // For dialog version, we need to check if skills are selected
    const mySkillId = isDirectSkills ? props.mySkillId : selectedMySkillId
    const theirSkillId = isDirectSkills
      ? props.theirSkillId
      : selectedTheirSkillId

    if (!mySkillId || !theirSkillId) {
      toast('Please select both skills for the exchange.')
      return
    }

    setIsLoading(true)

    try {
      // Create the exchange
      const { data: exchange, error: exchangeError } = await supabase
        .from('exchanges')
        .insert({
          user1_id: userId,
          user2_id: partnerId!,
          status: 'pending',
          created_by: userId
        })
        .select()
        .single()

      if (exchangeError) throw exchangeError

      // Create the first swap (user1 teaches user2)
      const { data: swap1, error: swap1Error } = await supabase
        .from('swaps')
        .insert({
          teacher_id: userId,
          learner_id: partnerId!,
          skill_offering_id: mySkillId,
          status: 'pending'
        })
        .select()
        .single()

      if (swap1Error) throw swap1Error

      // Create the second swap (user2 teaches user1)
      const { data: swap2, error: swap2Error } = await supabase
        .from('swaps')
        .insert({
          teacher_id: partnerId!,
          learner_id: userId,
          skill_offering_id: theirSkillId,
          status: 'pending'
        })
        .select()
        .single()

      if (swap2Error) throw swap2Error

      // Update the exchange with the swap IDs
      const { error: updateError } = await supabase
        .from('exchanges')
        .update({
          swap1_id: swap1.id,
          swap2_id: swap2.id
        })
        .eq('id', exchange.id)

      if (updateError) throw updateError

      // Create a notification for the other user
      const { data: userData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

      await supabase.from('notifications').insert({
        user_id: partnerId!,
        type: 'exchange_request',
        title: 'New Exchange Request',
        message: `${userData?.username} has requested a skill exchange with you.`,
        related_type: 'exchanges',
        related_id: exchange.id,
        is_read: false
      })

      toast.success(`Exchange request sent to ${partnerName}.`)

      setIsOpen(false)
      router.refresh()
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error initiating exchange:', error)
        toast.error(
          error.message || 'Failed to initiate exchange. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // For direct skills, we don't need a dialog
  if (isDirectSkills) {
    return (
      <Button
        onClick={handleInitiateExchange}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader className='mr-2 h-4 w-4 animate-spin' /> Initiating...
          </>
        ) : (
          <>
            <RefreshCw className='mr-2 h-4 w-4' /> {buttonText}
          </>
        )}
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <RefreshCw className='mr-2 h-4 w-4' />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Initiate Skill Exchange</DialogTitle>
          <DialogDescription>
            Set up a reciprocal skill exchange with {partnerName} where you both
            teach each other.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='mySkill'>Skill you will teach</Label>
            <Select
              value={selectedMySkillId}
              onValueChange={setSelectedMySkillId}
            >
              <SelectTrigger id='mySkill'>
                <SelectValue placeholder='Select a skill to teach' />
              </SelectTrigger>
              <SelectContent>
                {!isDirectSkills && props.mySkillOfferings.length > 0 ? (
                  props.mySkillOfferings.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='none' disabled>
                    No skills available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='theirSkill'>Skill you want to learn</Label>
            <Select
              value={selectedTheirSkillId}
              onValueChange={setSelectedTheirSkillId}
            >
              <SelectTrigger id='theirSkill'>
                <SelectValue placeholder='Select a skill to learn' />
              </SelectTrigger>
              <SelectContent>
                {!isDirectSkills && props.theirSkillOfferings.length > 0 ? (
                  props.theirSkillOfferings.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='none' disabled>
                    No skills available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            onClick={handleInitiateExchange}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            Send Exchange Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
