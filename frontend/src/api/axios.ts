import axios from 'axios';
import { useAuthStore } from '@/features/auth/useAuthStore';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (res) => ({
        ...res,
        data: res.data.data || res.data,
    }),
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.post('/users/refresh-token');
                const newAccessToken = data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;