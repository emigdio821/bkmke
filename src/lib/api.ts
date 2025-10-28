import type { Bookmark, OGInfo } from '@/types'
import axios from 'axios'
import type { z } from 'zod'
import type { createAutomaticBookmarkSchema } from './schemas/form'
import { createClient } from './supabase/client'

export async function createBookmark(values: z.infer<typeof createAutomaticBookmarkSchema>) {
  const { folderId, tags: tagIds, url, isFavorite } = values
  if (!url) {
    return { error: 'Missing URL value' }
  }

  const supabase = createClient()
  let bookmarkPayload = null

  try {
    const { data: ogInfo } = await axios.get<OGInfo>('/api/og-info', { params: { url } })

    bookmarkPayload = {
      url,
      name: ogInfo.title,
      is_favorite: isFavorite,
      description: ogInfo.description,
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

  if (bookmark && bookmark.length > 0 && tagIds.length > 0) {
    const tagItemsPromises = []

    for (const tagId of tagIds) {
      const tagItemsPayload = { bookmark_id: bookmark[0].id, tag_id: tagId }

      tagItemsPromises.push(supabase.from('tag_items').insert(tagItemsPayload))
    }

    await Promise.all(tagItemsPromises)
  }

  if (error) {
    return { error: error.message }
  }
}

export async function toggleFavorite(bookmark: Bookmark) {
  const supabase = createClient()

  const { error } = await supabase
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

  if (error) {
    return { error: error.message }
  }
}
