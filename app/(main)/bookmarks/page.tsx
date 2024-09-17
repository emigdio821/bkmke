import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { siteConfig } from '@/config/site'
import { BOOKMARKS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { TypographyH4 } from '@/components/ui/typography'
import { BookmarksClientPage } from './page.client'

export const metadata: Metadata = {
  title: {
    default: 'Bookmarks',
    template: `%s · ${siteConfig.name}`,
  },
}

export default async function BookmarksPage() {
  const queryClient = new QueryClient()
  const supabase = createClient()
  const { data: bookmarks, error } = await supabase
    .schema('public')
    .from('bookmarks')
    .select('*, tag_items(tag_id, tags(name))')
    .order('name')

  if (error) {
    console.log('Error while getting bookmarks initial data', error.message)
  }

  if (bookmarks) {
    await queryClient.setQueryData([BOOKMARKS_QUERY], bookmarks)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TypographyH4>Bookmarks</TypographyH4>
      <BookmarksClientPage />
    </HydrationBoundary>
  )
}
