'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { CalendarIcon, Clock, Loader2, Plus, Trash } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface SkillOffering {
  id: string
  title: string
  description: string
  user_id: string
}

interface Swap {
  id: string
  status: string
  scheduled_times: string[] | null
  teacher_id: string
  learner_id: string
  skill_offerings: SkillOffering
}

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

interface Exchange {
  id: string
  status: string
  created_at: string
  updated_at: string
  user1_id: string
  user2_id: string
  swap1_id: string
  swap2_id: string
  created_by: string
  user1: Profile
  user2: Profile
  swap1: Swap
  swap2: Swap
}

interface ExchangeSchedulerProps {
  exchange: Exchange
  swapId: string
  disabled?: boolean
}

export function ExchangeScheduler({
  exchange,
  swapId,
  disabled = false
}: ExchangeSchedulerProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Get the relevant swap
  const swap = exchange.swap1_id === swapId ? exchange.swap1 : exchange.swap2

  // Get scheduled times from the swap
  const scheduledTimes = swap?.scheduled_times || []

  async function addSession() {
    if (!date || !time) {
      toast.error('Please select both a date and time for the session.')
      return
    }

    setIsLoading(true)

    try {
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number)
      const sessionDate = new Date(date)
      sessionDate.setHours(hours, minutes)

      // Add to scheduled_times array
      const updatedTimes = [...scheduledTimes, sessionDate.toISOString()]

      const { error } = await supabase
        .from('swaps')
        .update({ scheduled_times: updatedTimes })
        .eq('id', swapId)

      if (error) {
        throw error
      }

      toast.success(
        `Session scheduled for ${format(sessionDate, 'PPP')} at ${format(sessionDate, 'p')}`
      )

      // Reset form
      setDate(undefined)
      setTime('')

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to schedule session. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function removeSession(index: number) {
    setIsLoading(true)

    try {
      const updatedTimes = [...scheduledTimes]
      updatedTimes.splice(index, 1)

      const { error } = await supabase
        .from('swaps')
        .update({ scheduled_times: updatedTimes })
        .eq('id', swapId!)

      if (error) {
        throw error
      }

      toast.success('The scheduled session has been removed.')

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to remove session. Please try again.'
        )
      } else {
        toast.error('Unexpected error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Generate time options (30 min intervals)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  return (
    <div className='space-y-4'>
      {scheduledTimes.length > 0 ? (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>Scheduled Sessions</h3>
          <ul className='space-y-2'>
            {scheduledTimes.map((time: string, index: number) => (
              <li
                key={index}
                className='flex items-center justify-between rounded-md border p-2'
              >
                <div className='flex items-center'>
                  <Clock className='text-muted-foreground mr-2 h-4 w-4' />
                  <span>
                    {format(new Date(time), 'PPP')} at{' '}
                    {format(new Date(time), 'p')}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => removeSession(index)}
                  disabled={disabled || isLoading}
                >
                  <Trash className='h-4 w-4' />
                  <span className='sr-only'>Remove session</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-muted-foreground text-sm'>
          No sessions scheduled yet.
        </p>
      )}

      {!disabled && (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium'>Add New Session</h3>
          <div className='flex flex-wrap gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={date =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>

            <Select value={time} onValueChange={setTime} disabled={isLoading}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select time' />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(timeOption => (
                  <SelectItem key={timeOption} value={timeOption}>
                    {format(
                      new Date().setHours(
                        Number.parseInt(timeOption.split(':')[0]),
                        Number.parseInt(timeOption.split(':')[1])
                      ),
                      'p'
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={addSession} disabled={!date || !time || isLoading}>
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Plus className='mr-2 h-4 w-4' />
              )}
              Add Session
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
