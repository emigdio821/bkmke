'use client'

import type { UserMetadata } from '@/types'
import NiceModal from '@ebay/nice-modal-react'
import { IconReload, IconUser } from '@tabler/icons-react'
import { useProfile } from '@/hooks/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditDialog } from '@/components/dialogs/profile/edit'
import { SettingsProfileSkeleton } from '@/components/skeletons'

export function ProfileSettings() {
  const { data: profile, isLoading, refetch } = useProfile()
  const userMetadata = profile?.user_metadata as UserMetadata
  const appMetadata = profile?.app_metadata

  if (isLoading) return <SettingsProfileSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 text-sm sm:flex-row">
        {profile ? (
          <>
            <div className="flex items-center space-x-2">
              <Avatar className="size-16">
                <AvatarImage src={userMetadata?.avatar || ''} alt="User avatar" />
                <AvatarFallback asChild>
                  <div className="size-16 rounded-md">
                    <IconUser className="size-4" />
                  </div>
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                {profile.user_metadata.name && <p className="font-medium">{userMetadata?.name}</p>}
                <p className="text-muted-foreground">{profile.email}</p>
                {userMetadata?.profile_updated_at && (
                  <p>
                    <span className="text-muted-foreground">Last update: </span>
                    <span>{new Date(userMetadata.profile_updated_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>

            {appMetadata?.userrole !== 'demo' && (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => NiceModal.show(EditDialog, { user: profile })}
              >
                Edit
              </Button>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="" alt="User avatar" className="size-16 rounded-md" />
              <AvatarFallback>
                <div className="size-16 rounded-md bg-gradient-to-r from-emerald-500 to-indigo-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p>Unable to fetch your profile</p>
              <Button
                variant="link"
                onClick={() => {
                  void refetch()
                }}
              >
                Refetch <IconReload className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
