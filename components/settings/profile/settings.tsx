'use client'

import NiceModal from '@ebay/nice-modal-react'
import { IconReload, IconUser } from '@tabler/icons-react'
import { areModificationsEnabled } from '@/lib/utils'
import { useProfile } from '@/hooks/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { EditDialog } from '@/components/dialogs/profile/edit'
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
              <Avatar className="size-16">
                <AvatarImage src={profile.avatar_url || ''} alt="User avatar" />
                <AvatarFallback>
                  <IconUser size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div>
                  {profile.first_name && <span className="font-medium">{profile.first_name}</span>}
                  {profile.last_name && <span className="font-medium"> {profile.last_name}</span>}
                </div>
                <p className="text-muted-foreground">{profile.email}</p>
                {profile.updated_at && (
                  <p>
                    <span className="text-muted-foreground">Last update: </span>
                    <span>{new Date(profile.updated_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="" alt="User avatar" className="size-16 rounded-md" />
              <AvatarFallback>
                <div className="size-16 rounded-md bg-linear-to-r from-emerald-500 to-indigo-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p>Unable to fetch your profile</p>
              <Button variant="link" onClick={() => refetch()}>
                Refetch <IconReload className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {areModificationsEnabled() && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => NiceModal.show(EditDialog, { user: profile })}
          >
            Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
