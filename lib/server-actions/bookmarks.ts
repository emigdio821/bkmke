'use server'

import type { BkOGInfo, Bookmark, OGInfo } from '@/types'
import type { z } from 'zod'
import type { createManualBookmarkSchema } from '../schemas/form'
import { createClient } from '@/lib/supabase/server'
import { getOgInfo } from './og-info'

const ALL_BOOKMARKS_SELECT = `
  *,
  tag_items!bookmark_id(id, tag:tags(id,name)),
  folder:folders(name)
`

export type CreateBookmarkValues = z.infer<typeof createManualBookmarkSchema>

export async function createBookmark(bookmarkValues: CreateBookmarkValues) {
  const supabase = await createClient()
  const { folderId, tags: tagIds, url, isFavorite, name, description } = bookmarkValues

  if (!url) {
    return { error: 'Missing URL value' }
  }

  let bookmarkPayload = null

  try {
    const ogInfo = await getOgInfo(url)

    bookmarkPayload = {
      url,
      name: name || ogInfo.title,
      is_favorite: isFavorite,
      description: description || ogInfo.description,
      folder_id: folderId || null,
      og_info: {
        title: ogInfo.title,
        imageUrl: ogInfo.imageUrl,
        faviconUrl: ogInfo.faviconUrl,
        description: ogInfo.description,
      } satisfies OGInfo,
    }
  } catch (err) {
    bookmarkPayload = {
      url,
      name: url,
      description: '',
      is_favorite: isFavorite,
      folder_id: folderId || null,
      og_info: {
        title: url,
        imageUrl: '',
        faviconUrl: '',
        description: '',
      } satisfies OGInfo,
    }
    console.log('Get og info error:', err)
  }

  const { data: bookmark, error } = await supabase.from('bookmarks').insert(bookmarkPayload).select()

  if (error) {
    return { error: error.message }
  }

  if (bookmark && bookmark.length > 0 && tagIds.length > 0) {
    const tagItemsPromises = []

    for (const tagId of tagIds) {
      const tagItemsPayload = { bookmark_id: bookmark[0].id, tag_id: tagId }

      tagItemsPromises.push(supabase.from('tag_items').insert(tagItemsPayload))
    }

    try {
      await Promise.all(tagItemsPromises)
    } catch (err) {
      console.error('Error creating new bookmark tag items:', err)
      return { error: err instanceof Error ? err.message : 'Error creating new bookmark tag items' }
    }
  }
}

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

export async function exportBookmarkUrls() {
  const supabase = await createClient()
  return supabase.from('bookmarks').select('url')
}

interface EditBookmarkValues {
  url: string
  name: string
  description: string
  og_info: BkOGInfo
  is_favorite: boolean
  folder_id: string | null
}

export async function editBookmark(bookmarkId: string, values: EditBookmarkValues) {
  const supabase = await createClient()
  return supabase.from('bookmarks').update(values).eq('id', bookmarkId).select()
}

export async function getBookmarkById(bookmarkId: string) {
  const supabase = await createClient()
  return supabase.from('bookmarks').select(ALL_BOOKMARKS_SELECT).eq('id', bookmarkId).single()
}
