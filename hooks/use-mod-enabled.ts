import { useQuery } from '@tanstack/react-query'
import { loggedInUserProfileQuery } from '@/lib/ts-queries/profile'

export function useModEnabled() {
  const { data: profile } = useQuery(loggedInUserProfileQuery())

  if (!profile) return false

  if (profile.user_role === 'admin' || profile.user_role === 'pro') {
    return true
  }

  return false
}
