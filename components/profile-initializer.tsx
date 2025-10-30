'use client'

import type { loggedInUserProfileData } from '@/lib/ts-queries/profile'
import { useQuery } from '@tanstack/react-query'
import { loggedInUserProfileQuery } from '@/lib/ts-queries/profile'

interface ProfileInitializerProps {
  profileData?: loggedInUserProfileData
}

export function ProfileInitializer({ profileData }: ProfileInitializerProps) {
  useQuery(loggedInUserProfileQuery({ initialData: profileData }))

  return null
}
