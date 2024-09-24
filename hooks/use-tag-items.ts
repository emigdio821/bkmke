import { useQuery } from '@tanstack/react-query'
import { TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTagItems(tagId: number) {
  const supabase = createClient()

  async function getTagItems() {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, tag_items(id, tags(id,name)), folders(name)')
      .order('name')

    if (error) {
      console.log('Unable to fetch tag items', error.message)
    }

    const filteredData = data?.filter((item) => {
      return item.tag_items.some((tag) => tag.tags?.id === tagId)
    })

    return filteredData || []
  }

  return useQuery({ queryKey: [TAG_ITEMS_QUERY, tagId], queryFn: getTagItems })
}
