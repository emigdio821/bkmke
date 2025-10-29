import { getFolderDetails, getFolderItems, listFolders } from '@/server-functions/folders'
import { queryOptions } from '@tanstack/react-query'

export const FOLDERS_QUERY_KEY = 'folders'
export const FOLDER_ITEMS_QUERY_KEY = 'folder-items'

export const folderListQuery = () =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: listFolders,
  })

export const folderDetailsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, folderId],
    queryFn: () => getFolderDetails({ data: { folderId } }),
  })

export const folderItemsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY, folderId],
    queryFn: () => getFolderItems({ data: { folderId } }),
  })
