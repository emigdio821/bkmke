import type { QueryOptionsWithoutKeyAndFn } from './types'
import { queryOptions } from '@tanstack/react-query'
import { getAppSidebarItemCount } from '../server-actions/sidebar'

export const SIDEBAR_ITEM_COUNT_QUERY_KEY = 'sidebar-item-count'

export type SidebarItemCountData = Awaited<ReturnType<typeof getAppSidebarItemCount>>

export const appSidebarItemCountQuery = (options?: QueryOptionsWithoutKeyAndFn<SidebarItemCountData>) =>
  queryOptions({
    queryKey: [SIDEBAR_ITEM_COUNT_QUERY_KEY],
    queryFn: getAppSidebarItemCount,
    ...options,
  })
