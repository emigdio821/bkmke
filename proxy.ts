import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from './lib/supabase/server'

export async function proxy(req: NextRequest) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

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
