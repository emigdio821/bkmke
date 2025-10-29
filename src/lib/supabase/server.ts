import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'
import type { Database } from '@/types/database.types'
import { envClientSchema } from '@/lib/schemas/client-env'

export async function createClient() {
  return createServerClient<Database>(envClientSchema.VITE_SUPABASE_URL, envClientSchema.VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(name, value, options)
          }
        } catch (err) {
          console.log('Create server supabase error', err)
        }
      },
    },
  })
}
