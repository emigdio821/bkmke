import { useQuery } from '@tanstack/react-query'
import { PROFILE_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useProfile() {
  const supabase = createClient()

  async function getProfile() {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.log('Unable to fetch your profile', error.message)
    }

    return data?.user
  }

  return useQuery({ queryKey: [PROFILE_QUERY], queryFn: getProfile })
}
