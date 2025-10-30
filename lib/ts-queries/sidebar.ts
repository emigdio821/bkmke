import type { QueryOptionsWithoutKeyAndFn } from './types'
import { queryOptions } from '@tanstack/react-query'
import { getAppSidebarItemCount } from '../server-actions/sidebar'

export const SIDEBAR_ITEM_COUNT_QUERY_KEY = 'sidebar_item_count'

export type SidebarItemCountData = Awaited<ReturnType<typeof getAppSidebarItemCount>>

export const appSidebarItemCountQuery = (options?: QueryOptionsWithoutKeyAndFn<SidebarItemCountData>) =>
  queryOptions({
    queryKey: [SIDEBAR_ITEM_COUNT_QUERY_KEY],
    queryFn: getAppSidebarItemCount,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
  })
