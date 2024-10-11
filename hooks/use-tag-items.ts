import { useQuery } from '@tanstack/react-query'
import { TAG_ITEMS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export function useTagItems(tagId: number) {
  const supabase = createClient()

  async function getTagItems() {
    const { data, error } = await supabase
      .from('tag_items')
      .select(
        `
          bookmark:bookmarks!bookmark_id (
            *,
            tag_items!bookmark_id(id, tag:tags(id,name)),
            folder:folders(name)
          )
        `,
      )
      .eq('tag_id', tagId)

    if (error) {
      console.log('Unable to fetch tag items', error.message)
    }

    const formattedData = data?.map((item) => (Array.isArray(item.bookmark) ? item.bookmark[0] : item.bookmark)) || null

    if (formattedData) {
      formattedData.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    }

    return formattedData
  }

  return useQuery({ queryKey: [TAG_ITEMS_QUERY, tagId], queryFn: getTagItems })
}
