import type { UserProfile } from '@/types'
import type { Tables } from '@/types/database.types'
import { createClient } from '../supabase/server'

export async function getProfileData(): Promise<UserProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (userError) {
    console.error('Unable to fetch user:', userError.message)
    return null
  }

  if (claimsError) {
    console.error('Unable to fetch session claims:', claimsError.message)
    return null
  }

  if (!user) {
    console.error('User not found')
    return null
  }

  if (!claimsData) {
    console.error('Session claims not found')
    return null
  }

  const { data: profile, error: profilesError } = await supabase.from('profiles').select().eq('id', user.id).single()

  if (profilesError) {
    console.error('Unable to fetch profile:', profilesError.message)
    return null
  }

  const profileData: UserProfile = {
    email: user.email,
    user_role: claimsData.claims.user_role as Tables<'role_permissions'>['role'],
    ...profile,
  }

  return profileData
}
