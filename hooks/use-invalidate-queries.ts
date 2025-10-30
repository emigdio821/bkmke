import type { QueryFilters, QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

type InvalidateQueriesOptions = Omit<QueryFilters, 'queryKey'>

export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  async function invalidateQueries(queries: QueryKey | QueryKey[], options?: InvalidateQueriesOptions) {
    const isSingleQuery = queries.length > 0 && !Array.isArray(queries[0])

    if (isSingleQuery) {
      await queryClient.invalidateQueries({ queryKey: queries as QueryKey, ...options })
      return
    }

    const promises = (queries as QueryKey[]).map((queryKey) => {
      if (!Array.isArray(queryKey)) {
        console.error('Invalid query key - expected an array but received:', queryKey)
        return Promise.resolve()
      }
      return queryClient.invalidateQueries({ queryKey, ...options })
    })

    await Promise.all(promises)
  }

  return { invalidateQueries }
}
