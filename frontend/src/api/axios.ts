import axios from 'axios';
import { useAuthStore } from '@/features/auth/useAuthStore';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Gửi cookie refreshToken
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động refresh token
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/users/refresh-token');
                const newAccessToken = data.data.accessToken; // data.data!

                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;