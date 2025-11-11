// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthStore {
    user: { id: number; name: string; email: string } | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    login: async (email, password) => {
        // Giả lập API
        await new Promise(r => setTimeout(r, 1000));
        set({ user: { id: 1, name: 'Nguyễn Văn A', email } });
    },
    register: async (name, email, password) => {
        await new Promise(r => setTimeout(r, 1000));
        set({ user: { id: 1, name, email } });
    },
    logout: () => set({ user: null }),
}));