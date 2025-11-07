'use client'

import type { UserProfile } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { loggedInUserProfileQuery } from '@/lib/ts-queries/profile'

interface ProfileInitializerProps {
  profileData?: UserProfile | null
}

export function ProfileInitializer({ profileData }: ProfileInitializerProps) {
  useQuery({ ...loggedInUserProfileQuery(), initialData: profileData || undefined })

  return null
}
