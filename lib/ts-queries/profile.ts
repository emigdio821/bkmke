import type { QueryOptionsWithoutKeyAndFn } from './types'
import { queryOptions } from '@tanstack/react-query'
import { getLoggedInUserProfile } from '../server-actions/profile'

export const LOGGED_IN_USER_PROFILE_QUERY_KEY = 'logged_in_user_profile'

export type loggedInUserProfileData = Awaited<ReturnType<typeof getLoggedInUserProfile>>

export const loggedInUserProfileQuery = (options?: QueryOptionsWithoutKeyAndFn<loggedInUserProfileData>) =>
  queryOptions({
    queryKey: [LOGGED_IN_USER_PROFILE_QUERY_KEY],
    queryFn: getLoggedInUserProfile,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
  })
