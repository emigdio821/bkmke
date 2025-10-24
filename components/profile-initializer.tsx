'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/lib/stores/profile'
import { useProfile } from '@/hooks/use-profile'

export function ProfileInitializer() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const setLoadingProfile = useProfileStore((state) => state.setLoadingProfile)

  useEffect(() => {
    if (profile) {
      updateProfile(profile)
    }
  }, [profile, updateProfile])

  useEffect(() => {
    setLoadingProfile(isLoading)
  }, [isLoading, setLoadingProfile])

  return null
}
