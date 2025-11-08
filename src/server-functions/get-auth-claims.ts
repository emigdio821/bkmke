import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const getAuthClaims = createServerFn().handler(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (!data || error) {
    return null
  }

  return data.claims
})
