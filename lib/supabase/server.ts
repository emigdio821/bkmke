import type { Database } from '@/types/database.types'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { envClientSchema } from '@/lib/schemas/client-env'

export async function createClient() {
  const cookieStore = await cookies()

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
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch (err) {
            console.log('Create server supabase error', err)
          }
        },
      },
    },
  )
}
