'use server'

import type { z } from 'zod'
import type { editUserSchema } from '../schemas/form'
import { createClient } from '../supabase/server'

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
