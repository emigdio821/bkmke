'use client'

import { IconReload } from '@tabler/icons-react'
import { useProfile } from '@/hooks/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditDialog } from '@/components/settings/profile/edit-dialog'
import { SettingsProfileSkeleton } from '@/components/skeletons'

export function ProfileSettings() {
  const { data: profile, isLoading, refetch } = useProfile()

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
              <Avatar className="size-16 rounded-md">
                <AvatarImage src={profile.user_metadata.avatar} alt="User avatar" />
                <AvatarFallback asChild>
                  <div className="size-16 rounded-md bg-gradient-to-r from-emerald-500 to-indigo-400" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                {profile.user_metadata.name && <p className="font-medium">{profile.user_metadata.name}</p>}
                <p className="text-muted-foreground">{profile.email}</p>
                {profile.updated_at && (
                  <p>
                    <span className="text-muted-foreground">Last update: </span>
                    <span>{new Date(profile.updated_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>
            <EditDialog user={profile} />
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
