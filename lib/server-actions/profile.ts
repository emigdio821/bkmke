'use server'

import type { UserProfile } from '@/types'
import type { Tables } from '@/types/database.types'
import { jwtDecode } from 'jwt-decode'
import { createClient } from '../supabase/server'

export async function getLoggedInUserProfile() {
  const supabase = await createClient()

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
