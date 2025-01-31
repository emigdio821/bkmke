'use client'

import { siteConfig } from '@/config/site'
import { DEMO_ROLE } from '@/lib/constants'
import { useProfile } from '@/hooks/use-profile'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FoldersNavItems } from '@/components/folders/nav-items'
import { TagsNavItems } from '@/components/tags/nav-items'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { NavMain } from './nav-main'

export function NavContent() {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata

  return (
    <nav className="flex h-full w-full flex-col items-start border-r">
      <div className="flex w-full items-center gap-2 p-4 pb-0">
        <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
          bk
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold tracking-tight">{siteConfig.name}</span>
          <span className="truncate text-xs tracking-tight">Bookmark manager</span>
        </div>
      </div>

      <NavMain />

      <div className="h-auto w-full space-y-1 overflow-auto px-4 py-1">
        <FoldersNavItems />
        <TagsNavItems />
      </div>

      <div className="flex w-full grow flex-col justify-end gap-2 px-4 pb-4">
        {appMetadata?.userrole === DEMO_ROLE && (
          <Card className="bg-subtle">
            <CardHeader>
              <CardTitle>Demo mode</CardTitle>
              <CardDescription>All modifications are disabled.</CardDescription>
            </CardHeader>
          </Card>
        )}
        <UserProfileDropdown />
      </div>
    </nav>
  )
}
