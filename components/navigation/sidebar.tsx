import { NavContent } from './nav-content'

export async function Sidebar() {
  return (
    <aside className="sticky top-0 bottom-0 hidden h-dvh w-full overflow-hidden md:block">
      <NavContent />
    </aside>
  )
}
