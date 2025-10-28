import { parseAsString, useQueryState } from 'nuqs'

export function useGlobalSearch() {
  return useQueryState('search', parseAsString.withDefault(''))
}
