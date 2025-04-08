import { ProfileType } from '@/types/type'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

export interface ProfileWithEmail extends ProfileType {
  email: string
}

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<ProfileWithEmail | null> => {
      const supabase = createClient()

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()
      if (userError || !user) {
        return null
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        return null
      }

      return {
        ...data,
        email: user.email || ''
      } as ProfileWithEmail
    }
  })
}
