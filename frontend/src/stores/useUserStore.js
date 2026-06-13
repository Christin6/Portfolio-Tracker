import { create } from "zustand";

export const useUserStore = create((set) => ({
    currentUser: null,
    actions: {
        setCurrentUser: user => set({ currentUser: user }),
    }
}));