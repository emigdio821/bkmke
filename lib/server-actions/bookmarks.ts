'use server'

import { createClient } from '@/lib/supabase/server'

const ALL_BOOKMARKS_SELECT = `
  *,
  tag_items!bookmark_id(id, tag:tags(id,name)),
  folder:folders(name)
`

export async function listBookmarks() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('bookmarks').select(ALL_BOOKMARKS_SELECT).order('name')

  if (error) {
    console.error('Unable to fetch bookmarks:', error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data || []
}

export async function listFavoriteBookmarks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select(ALL_BOOKMARKS_SELECT)
    .eq('is_favorite', true)
    .order('name')

  if (error) {
    console.error('Unable to fetch favorite bookmarks:', error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data || []
}

export async function deleteBookmark(bookmarkId: string) {
  const supabase = await createClient()

  return supabase.from('bookmarks').delete().eq('id', bookmarkId)
}
