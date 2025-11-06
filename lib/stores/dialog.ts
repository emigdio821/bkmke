import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface StoreState {
  isLoading: boolean
  open: boolean
  toggle: (open?: boolean) => void
  toggleLoading: (loading?: boolean) => void
}

const storeCreator: StateCreator<StoreState> = (set) => ({
  open: false,
  isLoading: false,
  toggle: (open) => {
    set((state) => ({ open: open === undefined ? !state.open : open }))
  },
  toggleLoading: (loading) => {
    set((state) => ({ isLoading: loading === undefined ? !state.isLoading : loading }))
  },
})

export const useDialogStore = create<StoreState>()(devtools(storeCreator, { name: 'bkmke', store: 'dialog-store' }))
