'use client'

import { siteConfig } from '@/config/site'
import { isAdminRole } from '@/lib/utils'
import { useProfile } from '@/hooks/use-profile'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FoldersNavItems } from '@/components/folders/nav-items'
import { TagsNavItems } from '@/components/tags/nav-items'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { NavMain } from './nav-main'

export function NavContent() {
  const { data: profile } = useProfile()

  return (
    <>
      <div className="px-4 pb-0">
        <div className="flex w-full items-center gap-2 border-b border-dashed pb-4">
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
            bk
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold tracking-tight">{siteConfig.name}</span>
            <span className="truncate text-xs tracking-tight">Bookmark manager</span>
          </div>
        </div>
      </div>

      <NavMain />

      <div className="h-auto w-full space-y-1 overflow-auto p-4">
        <FoldersNavItems />
        <TagsNavItems />
      </div>

      <div className="flex w-full grow flex-col justify-end px-4">
        <div className="flex w-full flex-col gap-2 border-t border-dashed pt-4">
          {!isAdminRole(profile?.user_role) && (
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Demo mode</CardTitle>
                <CardDescription>All modifications are disabled.</CardDescription>
              </CardHeader>
            </Card>
          )}
          <UserProfileDropdown />
        </div>
      </div>
    </>
  )
}
