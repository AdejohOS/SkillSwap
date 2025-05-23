'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ArrowLeftRight, Loader } from 'lucide-react'

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

interface UserSkills {
  id: string
  title: string
  skill_categories: {
    name: string
  } | null
}

interface ExchangeInitiationButtonClientProps {
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
  userSkills: UserSkills[]
  userId: string
}

export function ExchangeInitiationButtonClient({
  skillId,
  teacherId,
  variant = 'default',
  size = 'default',
  className = '',
  userSkills = [],
  userId
}: ExchangeInitiationButtonClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  async function initiateExchange() {
    if (!selectedSkillId) {
      toast('You need to select one of your skills to offer in exchange.')
      return
    }

    setIsLoading(true)

    try {
      // Create the first swap (them teaching you)
      const { data: swap1, error: swap1Error } = await supabase
        .from('swaps')
        .insert({
          teacher_id: teacherId,
          learner_id: userId,
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
          teacher_id: userId,
          learner_id: teacherId,
          skill_offering_id: selectedSkillId,
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
          user1_id: userId,
          user2_id: teacherId,
          swap1_id: swap1.id,
          swap2_id: swap2.id,
          status: 'pending',
          created_by: userId
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
        message: 'Someone wants to exchange skills with you!',
        related_id: exchange.id,
        is_read: false
      })

      toast.success('Exchange request sent')

      setIsOpen(false)
      router.push(`/dashboard/exchanges/${exchange.id}`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to initiate exchange. Please try again.'
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
          <ArrowLeftRight className='mr-2 h-4 w-4' />
          Request Exchange
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
          {isLoading ? (
            <div className='flex justify-center py-4'>
              <Loader className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : userSkills.length > 0 ? (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='skill-select'>Select your skill to offer</Label>
                <Select
                  onValueChange={setSelectedSkillId}
                  value={selectedSkillId}
                >
                  <SelectTrigger id='skill-select'>
                    <SelectValue placeholder='Select a skill' />
                  </SelectTrigger>
                  <SelectContent>
                    {userSkills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.title}{' '}
                        {skill.skill_categories?.name
                          ? `(${skill.skill_categories.name})`
                          : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='rounded-lg bg-blue-50 p-4 text-blue-800'>
                <p className='flex items-center font-medium'>
                  <ArrowLeftRight className='mr-2 h-5 w-5' />
                  How skill exchanges work
                </p>
                <p className='mt-2 text-sm'>
                  You&apos;ll teach your selected skill, and in return,
                  you&apos;ll learn the skill you&apos;re requesting. Both
                  parties need to accept the exchange before scheduling
                  sessions.
                </p>
              </div>
            </div>
          ) : (
            <div className='rounded-lg bg-amber-50 p-4 text-amber-800'>
              <p className='font-medium'>
                You don&apos;t have any skills to offer yet.
              </p>
              <p className='mt-2 text-sm'>
                To initiate an exchange, you need to add at least one skill that
                you can teach. Go to &apos;My Skills&apos; to add a skill.
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
            onClick={initiateExchange}
            disabled={isLoading || userSkills.length === 0 || !selectedSkillId}
          >
            {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Initiate Exchange
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
