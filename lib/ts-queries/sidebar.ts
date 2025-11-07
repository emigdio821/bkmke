import type { SidebarItemCountData } from '@/types'
import { queryOptions } from '@tanstack/react-query'

export const SIDEBAR_ITEM_COUNT_QUERY_KEY = 'sidebar_item_count'

export const appSidebarItemCountQuery = () =>
  queryOptions({
    queryKey: [SIDEBAR_ITEM_COUNT_QUERY_KEY],
    queryFn: async (): Promise<SidebarItemCountData> => {
      const response = await fetch('/api/sidebar/item-count')
      if (!response.ok) {
        throw new Error('Failed to fetch sidebar item counts')
      }
      return response.json()
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
