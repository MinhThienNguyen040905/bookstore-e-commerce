import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
// Axios instance (baseURL, headers)
const api = axios.create({
    baseURL: 'http://localhost:3000/api',  // Thay bằng backend URL (e.g., /api/books)
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    // Optional: Add auth token: headers: { Authorization: `Bearer ${token}` }
});



api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/refresh-token');
                const newAccessToken = data.accessToken;

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