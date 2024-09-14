import { Menu } from './menu'
import { TypographyH3 } from '../ui/typography'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'

export async function Sidebar() {
  const supabase = createClient()
  const { data: folders, error } = await supabase.schema('public').from('folders').select()
  const { data: tags, error: tagsError } = await supabase.schema('public').from('tags').select()

  if (error || tagsError) return null

  return (
    <aside className="fixed top-0 left-0 z-20 h-screen hidden sm:block w-64 lg:w-72">
      <div className="relative h-full flex flex-col border-r">
        <span className="flex items-center p-6 pb-0 max-h-14 ustify-center">
          <TypographyH3>{siteConfig.name}</TypographyH3>
        </span>
        <Menu folders={folders} tags={tags} />
      </div>
    </aside>
  )
}
