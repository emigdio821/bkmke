import { parseAsIndex, parseAsInteger, useQueryStates } from 'nuqs'

export function useQueryPagination() {
  const paginationParsers = {
    pageIndex: parseAsIndex.withDefault(0),
    pageSize: parseAsInteger.withDefault(12),
  }
  const paginationUrlKeys = {
    pageIndex: 'page',
    pageSize: 'perPage',
  }

  return useQueryStates(paginationParsers, {
    urlKeys: paginationUrlKeys,
  })
}
