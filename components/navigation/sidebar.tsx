import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { TypographyH3 } from '../ui/typography'
import { Menu } from './menu'

export async function Sidebar() {
  const supabase = createClient()
  const { data: folders, error } = await supabase.schema('public').from('folders').select()
  const { data: tags, error: tagsError } = await supabase.schema('public').from('tags').select()

  if (error || tagsError) return null

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 sm:block lg:w-72">
      <div className="relative flex h-full flex-col border-r">
        <span className="ustify-center flex max-h-14 items-center p-6 pb-0">
          <TypographyH3>{siteConfig.name}</TypographyH3>
        </span>
        <Menu folders={folders} tags={tags} />
      </div>
    </aside>
  )
}
