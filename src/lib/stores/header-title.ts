import { create, type StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreState {
  isLoading: boolean
  title: string | null
  updateTitle: (title: string | null) => void
  setLoadingTitle: (isLoading: boolean) => void
}

const storeCreator: StateCreator<StoreState> = (set) => ({
  title: null,
  isLoading: false,
  updateTitle: (title) => {
    set(() => ({ title }))
  },
  setLoadingTitle: (isLoading) => {
    set(() => ({ isLoading }))
  },
})

export const useHeaderTitleStore = create<StoreState>()(
  devtools(storeCreator, { name: 'bkmke', store: 'header-title-store' }),
)
