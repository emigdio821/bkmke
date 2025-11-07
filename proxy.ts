import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { serverEnv } from './lib/env'
import { SupabaseSafeSession } from './lib/supabase-safe-session'
import { createClient } from './lib/supabase/server'

export async function proxy(req: NextRequest) {
  const supabase = await createClient()
  const safeSession = new SupabaseSafeSession(supabase, serverEnv.SUPABASE_SECRET)
  const { data, error } = await safeSession.getUser()

  if (req.nextUrl.pathname === '/login' && data) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (req.nextUrl.pathname !== '/login' && (error || !data)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  NextResponse.next({
    request: req,
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/*.*|sitemap.xml|robots.txt).*)'],
}
