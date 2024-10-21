import { NavContent } from './nav-content'

export async function Sidebar() {
  return (
    <aside className="sticky bottom-0 top-0 hidden h-dvh w-full overflow-hidden md:block">
      <NavContent />
    </aside>
  )
}
