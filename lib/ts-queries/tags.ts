import { queryOptions } from '@tanstack/react-query'
import { getTagDetails, getTagItems, listTags } from '@/lib/server-actions/tags'

export const TAGS_QUERY_KEY = 'tags'
export const TAG_ITEMS_QUERY_KEY = 'tag_items'

export type TagListData = Awaited<ReturnType<typeof listTags>>
export type TagDetailsData = Awaited<ReturnType<typeof getTagDetails>>
export type TagItemsData = Awaited<ReturnType<typeof getTagItems>>

export const tagListQuery = () =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: listTags,
  })

export const tagDetailsQuery = (tagId: string) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, tagId],
    queryFn: () => getTagDetails(tagId),
  })

export const tagItemsQuery = (tagId: string) =>
  queryOptions({
    queryKey: [TAGS_QUERY_KEY, TAG_ITEMS_QUERY_KEY, tagId],
    queryFn: () => getTagItems(tagId),
  })
