import type { QueryOptionsWithoutKeyAndFn } from './types'
import { queryOptions } from '@tanstack/react-query'
import { getFolderDetails, getFolderItems, listFolders } from '@/lib/server-actions/folders'

export const FOLDERS_QUERY_KEY = 'folders'
export const FOLDER_ITEMS_QUERY_KEY = 'folder_items'

export type FolderListData = Awaited<ReturnType<typeof listFolders>>
export type FolderDetailsData = Awaited<ReturnType<typeof getFolderDetails>>
export type FolderItemsData = Awaited<ReturnType<typeof getFolderItems>>

export const folderListQuery = (options?: QueryOptionsWithoutKeyAndFn<FolderListData>) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: listFolders,
    ...options,
  })

export const folderDetailsQuery = (folderId: string, options?: QueryOptionsWithoutKeyAndFn<FolderDetailsData>) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, folderId],
    queryFn: () => getFolderDetails(folderId),
    ...options,
  })

export const folderItemsQuery = (folderId: string, options?: QueryOptionsWithoutKeyAndFn<FolderItemsData>) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY, folderId],
    queryFn: () => getFolderItems(folderId),
    ...options,
  })
