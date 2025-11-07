import type { Bookmark } from '@/types'
import type { Tables } from '@/types/database.types'
import { queryOptions } from '@tanstack/react-query'

export const TAGS_QUERY_KEY = 'tags'
export const TAG_ITEMS_QUERY_KEY = 'tag_items'

export type TagListData = Tables<'tags'> & { items: { count: number }[] }
export type TagDetailsData = Tables<'tags'>

export const tagListQuery = () =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: async (): Promise<TagListData[]> => {
      const response = await fetch('/api/tags')
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }
      return response.json()
    },
  })

export const tagDetailsQuery = (tagId: string) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, tagId],
    queryFn: async (): Promise<TagDetailsData> => {
      const response = await fetch(`/api/tags/${tagId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tag details')
      }
      return response.json()
    },
  })

export const tagItemsQuery = (tagId: string) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, TAG_ITEMS_QUERY_KEY, tagId],
    queryFn: async (): Promise<Bookmark[]> => {
      const response = await fetch(`/api/tags/${tagId}/items`)
      if (!response.ok) {
        throw new Error('Failed to fetch tag items')
      }
      return response.json()
    },
  })
