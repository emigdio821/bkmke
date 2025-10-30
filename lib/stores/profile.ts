import type { UserProfile } from '@/types'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreState {
  isLoading: boolean
  profile: UserProfile | null
  updateProfile: (profile: UserProfile | null) => void
  setLoadingProfile: (isLoading: boolean) => void
}

const storeCreator: StateCreator<StoreState> = (set) => ({
  profile: null,
  isLoading: true,
  updateProfile: (profile) => {
    set(() => ({ profile }))
  },
  setLoadingProfile: (isLoading) => {
    set(() => ({ isLoading }))
  },
})

export const useProfileStore = create<StoreState>()(devtools(storeCreator, { name: 'bkmke', store: 'profile-store' }))
