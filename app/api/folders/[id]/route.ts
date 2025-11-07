import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/folders/[id]'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select().eq('id', id).order('name').single()

  if (error) {
    throw new Error('Unable to fetch folder:', { cause: error.message })
  }

  return Response.json(data || [])
}
