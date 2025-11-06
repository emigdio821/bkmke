import { ALL_BOOKMARKS_SELECT } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select(ALL_BOOKMARKS_SELECT)
    .eq('is_favorite', true)
    .order('name')

  if (error) {
    throw new Error('Unable to fetch favoritre bookmarks:', { cause: error.message })
  }

  return Response.json(data || [])
}
