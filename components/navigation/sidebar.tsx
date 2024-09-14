import { Menu } from './menu'
import { TypographyH3 } from '../ui/typography'
import { siteConfig } from '@/config/site'

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 z-20 h-screen hidden sm:block w-64 lg:w-72">
      <div className="relative h-full flex flex-col border-r">
        <span className="flex items-center p-6 pb-0 max-h-14 ustify-center">
          <TypographyH3>{siteConfig.name}</TypographyH3>
        </span>
        <Menu menuList={[]} />
      </div>
    </aside>
  )
}
