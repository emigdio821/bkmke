import type { Database } from '@/types/database.types'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { serverEnv } from '../env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_ANON_KEY, {
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
  })
}
