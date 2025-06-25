'use client'

import { useQueryClient } from '@tanstack/react-query'
import { RotateCwIcon } from 'lucide-react'
import { PROFILE_QUERY } from '@/lib/constants'
import { useProfileStore } from '@/lib/stores/profile'
import { areModificationsEnabled } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { EditProfileDialog } from '@/components/dialogs/profile/edit'
import { SettingsProfileSkeleton } from '@/components/skeletons'

export function ProfileSettings() {
  const queryClient = useQueryClient()
  const profile = useProfileStore((state) => state.profile)
  const isProfileLoading = useProfileStore((state) => state.isLoading)

  async function handleRefetchProfile() {
    try {
      await queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY] })
    } catch (err) {
      console.error('Failed to refetch profile', err)
    }
  }

  if (isProfileLoading) return <SettingsProfileSkeleton />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 text-sm sm:flex-row">
        {profile ? (
          <div className="flex items-center space-x-2">
            <Avatar className="size-16">
              <AvatarImage src={profile.avatar_url || ''} alt="User avatar" />
              <AvatarFallback />
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
        ) : (
          <div className="flex items-center space-x-2">
            <Avatar className="size-16">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback />
            </Avatar>
            <div>
              <p>Unable to fetch your profile at this time</p>
              <Button variant="outline" size="sm" onClick={handleRefetchProfile}>
                Refetch <RotateCwIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {profile && areModificationsEnabled() && (
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
