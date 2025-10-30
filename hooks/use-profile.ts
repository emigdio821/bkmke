import type { UserProfile } from '@/types'
import type { Tables } from '@/types/database.types'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { PROFILE_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useProfile() {
  const supabase = createClient()

  async function getProfile(): Promise<UserProfile> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.log('Unable to fetch your profile', error.message)
      throw new Error(error?.message)
    }

    if (!session) {
      console.log('Unable to fetch your session')
      throw new Error('Unable to fetch your session')
    }
    const { user } = session
    const jwt = jwtDecode<{ user_role: Tables<'role_permissions'>['role'] | null }>(session.access_token)
    const userRole = jwt.user_role

    const { data: profile, error: profilesError } = await supabase.from('profiles').select().eq('id', user.id).single()

    if (profilesError) {
      console.log('Unable to fetch your profile', profilesError.message)
      throw new Error(profilesError.message)
    }

    const profileData: UserProfile = { email: user.email, user_role: userRole, ...profile }

    return profileData
  }

  return useQuery({
    queryKey: [PROFILE_QUERY],
    queryFn: getProfile,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}
