import { create } from "zustand";

export const useUserStore = create((set) => ({
  currentUser: null,
  isInitialized: false,
  actions: {
    setCurrentUser: (user) => set({ currentUser: user }),
    setInitialized: () => set({ isInitialized: true }),
  },
}));
