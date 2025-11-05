'use server'

import type { Bookmark } from '@/types'
import { createClient } from '@/lib/supabase/server'

interface SyncTagItemsOptions {
  bookmarkId: string
  tagIds?: string[]
}

export async function syncTagItems({ bookmarkId, tagIds = [] }: SyncTagItemsOptions) {
  const supabase = await createClient()

  try {
    if (tagIds.length > 0) {
      // Create payload for upserting tag items
      const tagItemsPayload = tagIds.map((tagId) => ({
        tag_id: tagId,
        bookmark_id: bookmarkId,
      }))

      // Upsert the new tag items
      const { error: upsertError } = await supabase
        .from('tag_items')
        .upsert(tagItemsPayload, { onConflict: 'bookmark_id, tag_id' })

      if (upsertError) {
        return { error: upsertError.message }
      }

      // Delete tag items that are no longer associated
      const remainingTags = tagIds.join(',')
      const { error: deleteError } = await supabase
        .from('tag_items')
        .delete()
        .eq('bookmark_id', bookmarkId)
        .not('tag_id', 'in', `(${remainingTags})`)

      if (deleteError) {
        return { error: deleteError.message }
      }
    } else {
      // If no tags provided, delete all tag items for this bookmark
      const { error: deleteError } = await supabase.from('tag_items').delete().eq('bookmark_id', bookmarkId)

      if (deleteError) {
        return { error: deleteError.message }
      }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to sync tag items' }
  }
}

export async function getTagItems(tagId: string) {
  if (!tagId) {
    console.error('getTagItems: tagId is required')
    return []
  }

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
    .eq('tag_id', tagId)

  if (error) {
    console.error('Unable to fetch tag items:', error.message)
    return []
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

  return formattedData || []
}
