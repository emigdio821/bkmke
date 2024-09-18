import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import { envClientSchema } from '@/lib/schemas/client-env'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    envClientSchema.NEXT_PUBLIC_SUPABASE_URL,
    envClientSchema.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (err) {
            console.log('Create server supabase error', err)
          }
        },
      },
    },
  )
}
