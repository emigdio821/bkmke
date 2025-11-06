import type { Database } from '@/types/database.types'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { serverEnv } from '../env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        supabaseResponse = NextResponse.next({
          request,
        })
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options)
        }
      },
    },
  })

  const user = await supabase.auth.getUser()

  if (request.nextUrl.pathname === '/login' && user.data.user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (request.nextUrl.pathname !== '/login' && user.error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}
