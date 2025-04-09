'use client'

import { createClient } from '@/utils/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()
      console.log('Session Data before logout:', session) // Debugging session info

      if (sessionError) {
        console.error('Session check error:', sessionError)
        throw new Error('Failed to check for active session')
      }

      if (!session) {
        console.warn('No active session found, skipping logout')
        return { success: true, message: 'No active session found' }
      }

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        throw new Error('Failed to logout')
      }
      return {
        success: true,
        message: 'Logout successful'
      }
    },

    onSuccess: () => {
      queryClient.clear()

      router.push('/')
    },
    onError: (error: Error) => {
      console.error('Logout process error:', error.message)
    }
  })
}
