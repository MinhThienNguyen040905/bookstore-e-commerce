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
        // Backend luôn trả về { success: boolean, message?: string, data?: any }

        const { success, data, message } = response.data;

        if (success) {
            // Thành công → trả về data thật để react-query/zustand nhận đúng
            return { ...response, data };
        }

        // success === false → ném lỗi để vào catch block
        const error = new Error(message || 'Có lỗi xảy ra');
        // Gắn thêm thông tin để dễ debug
        (error as any).response = response;
        (error as any).isBackendError = true;
        throw error;
    },
    async (error) => {
        // Xử lý 401 + refresh token (giữ nguyên logic cũ)
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/users/refresh-token');
                const newAccessToken = data.data?.accessToken || data.accessToken;

                if (!newAccessToken) throw new Error('Không nhận được access token mới');

                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Các lỗi khác (mạng, 500, v.v.) hoặc lỗi backend success: false
        if (error.response) {
            // Nếu backend trả lỗi có cấu trúc { success: false, message }
            const backendMessage = error.response.data?.message;
            const msg = backendMessage || error.message || 'Lỗi không xác định';
            const err = new Error(msg);
            (err as any).response = error.response;
            return Promise.reject(err);
        }

        return Promise.reject(error);
    }
);

export default api;