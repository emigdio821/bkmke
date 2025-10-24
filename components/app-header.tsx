'use client'

import { usePathname } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { useHeaderTitleStore } from '@/lib/stores/header-title'
import { getHeaderTitleFromPath } from '@/lib/utils'
import { useGlobalSearch } from '@/hooks/use-global-search'
import { Separator } from '@/components/ui/separator'
import { AppHeaderActions } from './app-header-actions'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { SidebarTrigger } from './ui/sidebar'
import { Skeleton } from './ui/skeleton'
import { TypographyH4 } from './ui/typography'

const ACTIONS_DISABLED_PATHS = ['/settings']

export function AppHeader() {
  const pathname = usePathname()
  const titleFromPath = getHeaderTitleFromPath(pathname)
  const [search, setSearch] = useGlobalSearch()
  const headerTitle = useHeaderTitleStore((state) => state.title)
  const isTitleLoading = useHeaderTitleStore((state) => state.isLoading)

  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 w-full items-center border-b">
      <div className="flex w-full items-center gap-2 px-4 xl:mx-auto xl:max-w-5xl">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />

        {isTitleLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <TypographyH4 className="truncate">{titleFromPath || headerTitle}</TypographyH4>
        )}

        {ACTIONS_DISABLED_PATHS.includes(pathname) ? null : (
          <>
            <InputGroup className="ml-auto w-full max-w-xs">
              <InputGroupInput
                value={search}
                placeholder="Search"
                name="global-search"
                onChange={(event) => setSearch(event.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>

            <AppHeaderActions />
          </>
        )}
      </div>
    </header>
  )
}
