import { queryOptions } from '@tanstack/react-query'
import { getFolderDetails, getFolderItems, listFolders } from '@/lib/server-actions/folders'

export const FOLDERS_QUERY_KEY = 'folders'
export const FOLDER_ITEMS_QUERY_KEY = 'folder_items'

export type FolderListData = Awaited<ReturnType<typeof listFolders>>
export type FolderDetailsData = Awaited<ReturnType<typeof getFolderDetails>>
export type FolderItemsData = Awaited<ReturnType<typeof getFolderItems>>

export const folderListQuery = () =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: listFolders,
  })

export const folderDetailsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, folderId],
    queryFn: () => getFolderDetails(folderId),
  })

export const folderItemsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY, folderId],
    queryFn: () => getFolderItems(folderId),
  })
