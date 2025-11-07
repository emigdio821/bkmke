import type { UserProfile } from '@/types'
import { queryOptions } from '@tanstack/react-query'

export const LOGGED_IN_USER_PROFILE_QUERY_KEY = 'logged_in_user_profile'

export const loggedInUserProfileQuery = () =>
  queryOptions({
    queryKey: [LOGGED_IN_USER_PROFILE_QUERY_KEY],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch logged in user profile')
      }
      return response.json()
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
