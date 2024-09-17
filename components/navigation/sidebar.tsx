import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { siteConfig } from '@/config/site'
import { FOLDERS_QUERY, TAGS_QUERY } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import { TypographyH4 } from '@/components/ui/typography'
import { Menu } from './menu'

export async function Sidebar() {
  const supabase = createClient()
  const queryClient = new QueryClient()

  const { data: folders, error } = await supabase
    .schema('public')
    .from('folders')
    .select()
    .order('name', { ascending: true })

  const { data: tags, error: tagsError } = await supabase
    .schema('public')
    .from('tags')
    .select()
    .order('name', { ascending: true })

  if (error) {
    console.log('Failed to fetch folders', error.message)
  }

  if (tagsError) {
    console.log('Failed to fetch tags', tagsError.message)
  }

  if (folders) {
    await queryClient.setQueryData([FOLDERS_QUERY], folders)
  }

  if (tags) {
    await queryClient.setQueryData([TAGS_QUERY], tags)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <aside className="sticky top-0 hidden h-screen min-w-52 sm:block lg:min-w-60">
        <div className="relative flex h-full flex-col border-r">
          <span className="flex max-h-14 items-center p-4 pb-0">
            <TypographyH4>{siteConfig.name}</TypographyH4>
          </span>
          <Menu />
        </div>
      </aside>
    </HydrationBoundary>
  )
}
