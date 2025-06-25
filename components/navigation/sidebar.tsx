import { NavContent } from './nav-content'

export async function Sidebar() {
  return (
    <nav className="bg-sidebar fixed top-0 hidden h-full w-72 flex-col border-r pt-4 pb-4 lg:flex">
      <NavContent />
    </nav>
  )
}
