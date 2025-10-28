import { useQuery } from '@tanstack/react-query'
import { NAV_ITEMS_COUNT_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useNavItemsCount() {
  const supabase = createClient()

  async function getNavItemsCount() {
    const { count, error } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true })
    const { count: favsCount, error: favsError } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('is_favorite', true)

    if (error || favsError) {
      let msg = 'Unable to fetch initial items count:'

      if (error?.message) {
        msg += ` ${error.message}`
      }

      if (favsError?.message) {
        msg += ` ${favsError.message}`
      }
      console.error(msg)
    }

    return {
      bookmarksCount: count || 0,
      favoritesCount: favsCount || 0,
    }
  }

  return useQuery({
    queryKey: [NAV_ITEMS_COUNT_QUERY],
    queryFn: getNavItemsCount,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}
