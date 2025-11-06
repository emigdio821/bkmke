'use server'

import type { UserProfile } from '@/types'
import type { Tables } from '@/types/database.types'
import type { z } from 'zod'
import type { editUserSchema } from '../schemas/form'
import { createClient } from '../supabase/server'

export async function getLoggedInUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (userError) {
    console.error('Unable to fetch your user', userError.message)
  }

  if (claimsError) {
    console.error('Unable to fetch your session claims', claimsError.message)
  }

  if (!user) {
    console.error('Unable to fetch your user')
    throw new Error('Unable to fetch your user')
  }

  if (!claimsData) {
    console.error('Unable to fetch your session claims')
    throw new Error('Unable to fetch your session claims')
  }

  const { data: profile, error: profilesError } = await supabase.from('profiles').select().eq('id', user.id).single()

  if (profilesError) {
    console.log('Unable to fetch your profile', profilesError.message)
    throw new Error(profilesError.message)
  }

  const profileData: UserProfile = {
    email: user.email,
    user_role: claimsData.claims.user_role as Tables<'role_permissions'>['role'],
    ...profile,
  }

  return profileData
}

type UpdateProfileValues = z.infer<typeof editUserSchema>

export async function updateProfile(values: UpdateProfileValues, profileId: string) {
  const supabase = await createClient()

  if (values.password) {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  return supabase
    .from('profiles')
    .update({
      first_name: values.firstName,
      last_name: values.lastName,
      avatar_url: values.avatarUrl,
    })
    .eq('id', profileId)
}
