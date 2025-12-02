// src/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/features/auth/useAuthStore';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor xử lý response mới từ backend
api.interceptors.response.use(
    (response) => {
        const { success, data } = response.data;
        if (success) return { ...response, data };

        const error = new Error(response.data.message || 'Lỗi từ server');
        (error as any).response = response;
        throw error;
    },

    async (error) => {
        const originalRequest = error.config;

        // TRÁNH VÒNG LẶP VÔ HẠN: Không retry nếu chính request refresh token bị 401
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            // QUAN TRỌNG: nếu URL chính là refresh-token thì KHÔNG được retry
            !originalRequest.url?.includes('/users/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/users/refresh-token');

                // Backend trả: { success: true, data: { accessToken: "..." } }
                const newAccessToken = data?.accessToken || data?.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error('Không nhận được access token mới');
                }

                // Cập nhật token trong store + header
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Thử lại request ban đầu
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token hết hạn hoặc sai → bắt buộc logout
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Các lỗi khác (mạng, 500, hoặc refresh token fail)
        if (error.response) {
            const msg = error.response.data?.message || error.message;
            const err = new Error(msg);
            (err as any).response = error.response;
            return Promise.reject(err);
        }

        return Promise.reject(error);
    }
);

export default api;