import { getFolderDetails } from '@/server-functions/get-folder-details'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import type { Tables } from '@/types/database.types'
import { FOLDERS_QUERY } from '@/lib/constants'

type InitialData = Tables<'folders'>[] | null

export function useFolderDetails(folderId: string, initialData?: InitialData) {
  const getFolderDetailsFn = useServerFn(getFolderDetails)

  return useQuery({
    initialData,
    queryKey: [FOLDERS_QUERY, folderId],
    queryFn: () => getFolderDetailsFn({ data: { folderId } }),
  })
}
