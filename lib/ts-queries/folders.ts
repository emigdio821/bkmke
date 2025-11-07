import type { Bookmark, Folder } from '@/types'
import type { Tables } from '@/types/database.types'
import { queryOptions } from '@tanstack/react-query'

export const FOLDERS_QUERY_KEY = 'folders'
export const FOLDER_ITEMS_QUERY_KEY = 'folder_items'

export const folderListQuery = () =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: async (): Promise<Folder[]> => {
      const response = await fetch('/api/folders')
      if (!response.ok) {
        throw new Error('Failed to fetch folders')
      }
      return response.json()
    },
  })

export const folderDetailsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, folderId],
    queryFn: async (): Promise<Tables<'folders'>> => {
      const response = await fetch(`/api/folders/${folderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch folder details')
      }
      return response.json()
    },
  })

export const folderItemsQuery = (folderId: string) =>
  queryOptions({
    queryKey: [FOLDERS_QUERY_KEY, FOLDER_ITEMS_QUERY_KEY, folderId],
    queryFn: async (): Promise<Bookmark[]> => {
      const response = await fetch(`/api/folders/${folderId}/items`)
      if (!response.ok) {
        throw new Error('Failed to fetch folder items')
      }
      return response.json()
    },
  })
