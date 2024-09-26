import { siteConfig } from '@/config/site'
import { TypographyH4 } from '@/components/ui/typography'
import { NavContent } from './nav-content'

export async function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-full md:block">
      <div className="relative flex h-full flex-col border-r">
        <span className="flex max-h-14 items-center p-4 pb-0">
          <TypographyH4>{siteConfig.name}</TypographyH4>
        </span>
        <NavContent />
      </div>
    </aside>
  )
}
