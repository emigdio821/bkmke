'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { useHeaderTitleStore } from '@/lib/stores/header-title'
import { getHeaderTitleFromPath } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { AppHeaderActions } from './app-header-actions'
import { AppHeaderSearch } from './app-header-search'
import { SidebarTrigger } from './ui/sidebar'
import { Skeleton } from './ui/skeleton'
import { TypographyH4 } from './ui/typography'

const ACTIONS_DISABLED_PATHS = ['/settings']

function SearchSkeleton() {
  return (
    <>
      <Skeleton className="hidden h-9 w-full max-w-xs min-w-52 sm:flex" />
      <Skeleton className="size-10 sm:hidden" />
    </>
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const titleFromPath = getHeaderTitleFromPath(pathname)
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
          <div className="flex w-full flex-1 items-center justify-end gap-2">
            <Suspense fallback={<SearchSkeleton />}>
              <AppHeaderSearch />
            </Suspense>
            <AppHeaderActions />
          </div>
        )}
      </div>
    </header>
  )
}
