'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent, CardFooter } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface ExchangeMessagesProps {
  exchangeId: string
  otherUser: any
}

export function ExchangeMessages({
  exchangeId,
  otherUser
}: ExchangeMessagesProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch current user and messages on component mount
  useEffect(() => {
    async function fetchData() {
      // Get current user
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()

        setCurrentUser(profileData)
      }

      // Get messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('exchange_id', exchangeId)
        .order('created_at', { ascending: true })

      if (messagesData) {
        setMessages(messagesData)
      }

      // Subscribe to new messages
      const channel = supabase
        .channel(`exchange:${exchangeId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `exchange_id=eq.${exchangeId}`
          },
          payload => {
            setMessages(current => [...current, payload.new])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    fetchData()
  }, [exchangeId, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from('messages').insert({
        exchange_id: exchangeId,
        sender_id: currentUser.id,
        content: newMessage
      })

      if (error) {
        throw error
      }

      setNewMessage('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <p className='text-muted-foreground'>Loading messages...</p>
      </div>
    )
  }

  return <>Hello</>
}
