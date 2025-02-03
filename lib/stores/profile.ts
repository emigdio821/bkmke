import type { UserProfile } from '@/types'
import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreState {
  profile: UserProfile | null
  updateProfile: (profile: UserProfile | null) => void
}

const storeCreator: StateCreator<StoreState> = (set) => ({
  profile: null,
  updateProfile: (profile) => {
    set(() => ({ profile }))
  },
})

export const useProfileStore = create<StoreState>()(devtools(storeCreator, { name: 'bkmke', store: 'profile-store' }))
