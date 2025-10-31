'use client'

import { useQuery } from '@tanstack/react-query'
import { RotateCwIcon } from 'lucide-react'
import { EditProfileDialog } from '@/components/dialogs/profile/edit'
import { SettingsProfileSkeleton } from '@/components/skeletons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useModEnabled } from '@/hooks/use-mod-enabled'
import { loggedInUserProfileQuery } from '@/lib/ts-queries/profile'

export function ProfileSettings() {
  const { data: profile, isLoading, refetch } = useQuery(loggedInUserProfileQuery())
  const modEnabled = useModEnabled()

  if (isLoading) return <SettingsProfileSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 text-sm sm:flex-row">
        {profile ? (
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <Avatar className="size-16">
              <AvatarImage src={profile.avatar_url || ''} alt="User avatar" />
              <AvatarFallback />
            </Avatar>
            <div className="text-sm">
              <div className="flex max-w-xs items-center gap-2">
                <p>
                  {profile.first_name && <span className="font-medium">{profile.first_name}</span>}
                  {profile.last_name && <span className="font-medium"> {profile.last_name}</span>}
                </p>
                <Badge variant="outline">{profile.user_role}</Badge>
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
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="size-16">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback />
            </Avatar>
            <div>
              <p>Unable to fetch your profile at this time</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Refetch <RotateCwIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {profile && modEnabled && (
        <CardFooter>
          <EditProfileDialog
            profile={profile}
            trigger={
              <Button variant="outline" className="w-full sm:w-auto">
                Edit
              </Button>
            }
          />
        </CardFooter>
      )}
    </Card>
  )
}
