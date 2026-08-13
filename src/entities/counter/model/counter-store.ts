import type { ICounterStore } from './types'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useCounterStore = create<ICounterStore>()(
  immer((set) => ({
    count: 0,
    decrement: () =>
      set((state) => {
        state.count--
      }),
    increment: () =>
      set((state) => {
        state.count++
      }),
  })),
)
