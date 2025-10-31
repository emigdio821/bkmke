'use server'

import type { Bookmark } from '@/types'
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

export async function toggleFavoriteBookmark(bookmark: Bookmark) {
  const supabase = await createClient()

  return supabase
    .from('bookmarks')
    .update({
      url: bookmark.url,
      name: bookmark.name,
      description: bookmark.description,
      folder_id: bookmark.folder_id,
      og_info: bookmark.og_info,
      is_favorite: !bookmark.is_favorite,
    })
    .eq('id', bookmark.id)
}
