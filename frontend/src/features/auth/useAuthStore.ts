// src/features/auth/useAuthStore.ts  (ĐÃ SỬA HOÀN CHỈNH)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api/axios';
import { login, register, logout } from '@/api/authApi';
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

            // LOGIN
            login: async (email, password) => {
                try {
                    const { accessToken, user } = await login(email, password);
                    set({ user, accessToken });
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    //    showToast.success('Đăng nhập thành công!');
                } catch (err: any) {
                    // Login luôn do form xử lý toast → chỉ throw lại để form bắt
                    console.error('Login API error:', err);
                    throw err;

                }
            },

            // REGISTER
            register: async (name, email, password) => {
                const toastId = showToast.loading('Đang đăng ký...');
                try {
                    const response = await register(name, email, password);
                    // Lấy message từ backend (thường nằm trong response.data.message)
                    const message = response?.message || 'Đăng ký thành công! Vui lòng đăng nhập.';
                    showToast.dismiss(toastId);
                    showToast.success(message);
                } catch (err: any) {
                    showToast.dismiss(toastId);
                    const msg =
                        err?.response?.data?.message ||
                        err?.message ||
                        'Đăng ký thất bại, vui lòng thử lại';
                    showToast.error(msg);
                    throw err; // để form hoặc nơi gọi có thể catch tiếp
                }
            },

            // LOGOUT
            logout: async () => {
                try {
                    const response = await logout();
                    // Dùng message từ backend nếu có
                    const message = response?.message || 'Đã đăng xuất thành công';
                    showToast.success(message);
                } catch (err: any) {
                    console.error('Logout API error:', err);
                    // Dù API lỗi vẫn logout local và thông báo cho user biết
                    showToast.error('Lỗi server khi đăng xuất, nhưng bạn đã được đăng xuất local');
                } finally {
                    // Luôn luôn xóa state + header + storage
                    delete api.defaults.headers.common['Authorization'];
                    set({ user: null, accessToken: null });
                    localStorage.removeItem('auth-storage');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
        }
    )
);