import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/tags/[id]'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*, items:tag_items!inner(count)')
    .eq('id', id)
    .order('name')
    .single()

  if (error) {
    throw new Error('Unable to fetch tag details:', { cause: error.message })
  }

  return Response.json(data || [])
}
