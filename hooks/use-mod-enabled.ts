import { useProfileStore } from '@/lib/stores/profile'

export function useModEnabled() {
  const profile = useProfileStore((state) => state.profile)

  if (!profile) return false

  if (profile.user_role === 'admin' || profile.user_role === 'pro') {
    return true
  }

  return false
}
