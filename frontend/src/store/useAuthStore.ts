// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // ĐÚNG
import api from '@/api/axios';
import { showToast } from '@/lib/toast';

interface User {
    user_id: number;
    email: string;
    name: string;
    role: string;
    phone: string;
    address: string;
    avatar: string;
}

interface AuthStore {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setAccessToken: (accessToken) => {
                set({ accessToken });
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            },

            login: async (email, password) => {
                const toastId = showToast.loading('Đang đăng nhập...');
                try {
                    const { data } = await api.post('/users/login', { email, password });
                    const { accessToken, user } = data;

                    set({ user, accessToken });
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    showToast.dismiss(toastId);
                    showToast.success('Đăng nhập thành công!');
                } catch (err: unknown) {
                    showToast.dismiss(toastId);
                    const msg = err && typeof err === 'object' && 'response' in err
                        ? (err as any).response?.data?.msg
                        : 'Đăng nhập thất bại';
                    showToast.error(msg);
                    throw err;
                }
            },

            register: async (name, email, password) => {
                const toastId = showToast.loading('Đang đăng ký...');
                try {
                    await api.post('/users/register', { name, email, password });
                    showToast.dismiss(toastId);
                    showToast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                } catch (err: unknown) {
                    showToast.dismiss(toastId);
                    const msg = err && typeof err === 'object' && 'response' in err
                        ? (err as any).response?.data?.msg
                        : 'Đăng ký thất bại';
                    showToast.error(msg);
                    throw err;
                }
            },

            logout: () => {
                delete api.defaults.headers.common['Authorization'];
                set({ user: null, accessToken: null });
                showToast.success('Đã đăng xuất');
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
        }
    )
);