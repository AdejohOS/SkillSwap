'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { StringValidation } from 'zod'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface Message {
  id: string
  exchange_id: string | null
  sender_id: string
  content: string
  created_at: string | null
}

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

interface ExchangeMessagesProps {
  exchangeId: string
  otherUser: Profile
}

export function ExchangeMessages({
  exchangeId,
  otherUser
}: ExchangeMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch current user and messages on component mount
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()

        if (profileData) setCurrentUser(profileData)
      }

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('exchange_id', exchangeId)
        .order('created_at', { ascending: true })

      if (messagesData) setMessages(messagesData)

      // Subscribe to new messages
      channel = supabase
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
            setMessages(current => [...current, payload.new as Message])
          }
        )
        .subscribe()
    }

    fetchData()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [exchangeId])

  // Scroll to bottom when messages change
  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timeout)
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

      if (error) throw error

      setNewMessage('')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to send message. Please try again.'
        )
      }
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

  return (
    <>
      <CardContent className='flex-1 overflow-y-auto p-4'>
        {messages.length === 0 ? (
          <div className='flex h-full items-center justify-center'>
            <p className='text-muted-foreground text-center'>
              No messages yet. Start the conversation with {otherUser.username}!
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {messages.map(message => {
              const isCurrentUser = message.sender_id === currentUser.id

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex ${
                      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                    } max-w-[80%] items-start gap-2`}
                  >
                    {!isCurrentUser && (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={otherUser.avatar_url || '/placeholder.svg'}
                          alt={otherUser.username}
                        />
                        <AvatarFallback>
                          {otherUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                      <p
                        className={`text-muted-foreground mt-1 text-xs ${
                          isCurrentUser ? 'text-right' : ''
                        }`}
                      >
                        {message.created_at
                          ? new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )
                          : 'Unknown'}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={currentUser.avatar_url || '/placeholder.svg'}
                          alt='You'
                        />
                        <AvatarFallback>
                          {currentUser.username
                            ?.substring(0, 2)
                            .toUpperCase() || 'ME'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter className='border-t p-4'>
        <form onSubmit={sendMessage} className='flex w-full gap-2'>
          <Input
            placeholder='Type your message...'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            disabled={isLoading}
            className='flex-1'
          />
          <Button
            type='submit'
            size='icon'
            disabled={isLoading || !newMessage.trim()}
            aria-label='Send message'
          >
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </CardFooter>
    </>
  )
}
