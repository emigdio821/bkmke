'use client'

import { siteConfig } from '@/config/site'
import { DEMO_ROLE } from '@/lib/constants'
import { useProfile } from '@/hooks/use-profile'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'
import { FoldersNavItems } from '@/components/folders/nav-items'
import { TagsNavItems } from '@/components/tags/nav-items'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { NavMain } from './nav-main'

export function NavContent() {
  const { data: profile } = useProfile()
  const appMetadata = profile?.app_metadata

  return (
    <nav className="flex h-full w-full flex-col items-start border-r">
      <div className="w-full p-4 pb-0">
        <TypographyH4>{siteConfig.name}</TypographyH4>
      </div>

      <NavMain />

      <div className="h-auto w-full space-y-1 overflow-auto px-4">
        <FoldersNavItems />
        <TagsNavItems />
      </div>

      <div className="flex w-full grow flex-col justify-end gap-2 px-4 pb-4">
        {appMetadata?.userrole === DEMO_ROLE && (
          <Card className="bg-muted/50">
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
