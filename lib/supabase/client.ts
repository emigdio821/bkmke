import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import { envClientSchema } from '@/lib/schemas/client-env'

export function createClient() {
  return createBrowserClient<Database>(
    envClientSchema.NEXT_PUBLIC_SUPABASE_URL,
    envClientSchema.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
