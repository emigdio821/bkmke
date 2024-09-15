import { SheetMenu } from './navigation/sheet-menu'

// import { UserNav } from './navigation/user-nav'
// import { ThemeToggler } from './theme-toggler'
// import { useNavbarTitleStore } from '@/lib/stores/navbar-title'

export function Navbar() {
  // const navTitle = useNavbarTitleStore((state) => state.title)

  return (
    <header className="sticky top-0 z-10 block w-full bg-background sm:hidden">
      <div className="flex h-14 items-center border-b px-4 sm:px-6">
        <div className="flex items-center space-x-4 sm:space-x-0">
          <SheetMenu />
          {/* {navTitle && <h1 className="font-bold text-xl">{navTitle}</h1>} */}
          <h1 className="text-xl font-bold">Título</h1>
        </div>
        {/* <div className="flex flex-1 items-center space-x-2 justify-end">
          <ThemeToggler />
          <UserNav />
        </div> */}
      </div>
    </header>
  )
}
