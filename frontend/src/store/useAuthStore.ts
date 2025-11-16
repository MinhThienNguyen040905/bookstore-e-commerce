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

            // src/store/useAuthStore.ts
            login: async (email, password) => {
                try {
                    const { data } = await api.post('/users/login', { email, password });
                    const { accessToken, user } = data.data;

                    set({ user, accessToken });
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                } catch (err) {
                    console.error('Login failed:', err); // Log để debug
                    throw err; // Không toast ở đây
                }
            },
            register: async (name, email, password) => {
                const toastId = showToast.loading('Đang đăng ký...');
                try {
                    const { data } = await api.post(`/users/register`, { name, email, password });
                    showToast.dismiss(toastId);
                    showToast.success(data.message);
                } catch (err: unknown) {
                    showToast.dismiss(toastId);
                    const msg = err && typeof err === 'object' && 'response' in err
                        ? (err as any).response?.data?.message || 'Đăng ký thất bại'
                        : 'Lỗi mạng';
                    showToast.error(msg);
                    throw err;
                }
            },


            // src/store/useAuthStore.ts
            logout: async () => {
                try {
                    const { data } = await api.post('/users/logout');
                    showToast.success(data.message); // Dùng message từ backend
                } catch (err: unknown) {
                    // Nếu API lỗi (500), vẫn logout local
                    console.error('Logout API error:', err);
                    showToast.error('Lỗi khi đăng xuất từ server');
                } finally {
                    // Luôn xóa local state + storage + header
                    delete api.defaults.headers.common['Authorization'];
                    set({ user: null, accessToken: null });
                    localStorage.removeItem('auth-storage');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
        }
    )
);