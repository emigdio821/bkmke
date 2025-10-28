import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'

export const getAuthUser = createServerFn().handler(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (!data.user || error) {
    return null
  }

  return data.user
})
