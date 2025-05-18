'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardContent, CardFooter } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'

interface SwapMessagesProps {
  swapId: string
  otherUser: any
}

export const SwapMessages = ({ swapId, otherUser }: SwapMessagesProps) => {
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
        .eq('swap_id', swapId)
        .order('created_at', { ascending: true })

      if (messagesData) {
        setMessages(messagesData)
      }

      // Subscribe to new messages
      const channel = supabase
        .channel(`swap:${swapId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `swap_id=eq.${swapId}`
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
  }, [swapId, supabase])

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
        swap_id: swapId,
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
                    className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-start gap-2`}
                  >
                    {!isCurrentUser && (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            otherUser.avatar_url ||
                            '/placeholder.svg?height=32&width=32'
                          }
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
                        className={`text-muted-foreground mt-1 text-xs ${isCurrentUser ? 'text-right' : ''}`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            currentUser.avatar_url ||
                            '/placeholder.svg?height=32&width=32'
                          }
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
          >
            <Send className='h-4 w-4' />
            <span className='sr-only'>Send message</span>
          </Button>
        </form>
      </CardFooter>
    </>
  )
}
