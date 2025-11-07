import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/folders/[id]/items'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select(
      `
        *,
        tag_items!bookmark_id(id, tag:tags(id,name)),
        folder:folders(name)
      `,
    )
    .eq('folder_id', id)
    .order('name')

  if (error) {
    throw new Error('Unable to fetch folder items:', { cause: error.message })
  }

  return Response.json(data || [])
}
