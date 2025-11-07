import type { Bookmark } from '@/types'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/tags/[id]/items'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tag_items')
    .select(
      `
          bookmark:bookmarks!bookmark_id (
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          )
        `,
    )
    .eq('tag_id', id)

  if (error) {
    throw new Error('Unable to fetch tag items:', { cause: error.message })
  }

  const formattedData: Bookmark[] =
    data?.map((item) => (Array.isArray(item.bookmark) ? item.bookmark[0] : item.bookmark)) || null

  if (formattedData) {
    formattedData.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  return Response.json(formattedData || [])
}
