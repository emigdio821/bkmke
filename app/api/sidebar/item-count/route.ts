import type { SidebarItemCountData } from '@/types'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { count, error } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true })
  const { count: favsCount, error: favsError } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('is_favorite', true)

  if (error || favsError) {
    let msg = 'Unable to fetch initial items count:'

    if (error?.message) {
      msg += ` ${error.message}`
    }

    if (favsError?.message) {
      msg += ` ${favsError.message}`
    }
    console.error(msg)
  }

  const response: SidebarItemCountData = {
    bookmarksCount: count || 0,
    favoritesCount: favsCount || 0,
  }

  return Response.json(response)
}
