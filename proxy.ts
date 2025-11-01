import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(req: NextRequest) {
  return await updateSession(req)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/*.*|sitemap.xml|robots.txt).*)'],
}
