import type { QueryOptionsWithoutKeyAndFn } from './types'
import { queryOptions } from '@tanstack/react-query'
import { getTagDetails, getTagItems, listTags } from '@/lib/server-actions/tags'

export const TAGS_QUERY_KEY = 'tags'
export const TAG_ITEMS_QUERY_KEY = 'tag-items'

export type TagListData = Awaited<ReturnType<typeof listTags>>
export type TagDetailsData = Awaited<ReturnType<typeof getTagDetails>>
export type TagItemsData = Awaited<ReturnType<typeof getTagItems>>

export const tagListQuery = (options?: QueryOptionsWithoutKeyAndFn<TagListData>) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: listTags,
    ...options,
  })

export const tagDetailsQuery = (tagId: string, options?: QueryOptionsWithoutKeyAndFn<TagDetailsData>) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, tagId],
    queryFn: () => getTagDetails(tagId),
    ...options,
  })

export const tagItemsQuery = (tagId: string, options?: QueryOptionsWithoutKeyAndFn<TagItemsData>) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, TAG_ITEMS_QUERY_KEY, tagId],
    queryFn: () => getTagItems(tagId),
    ...options,
  })
