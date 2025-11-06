'use server'

import type { z } from 'zod'
import type { loginSchema } from '../schemas/form'
import { createClient } from '../supabase/server'

export type SignInWithPassValues = z.infer<typeof loginSchema>

export async function signInWithPassword(values: SignInWithPassValues) {
  const supabase = await createClient()
  return supabase.auth.signInWithPassword(values)
}

export async function signOut() {
  const supabase = await createClient()
  return supabase.auth.signOut()
}
