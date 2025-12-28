// src/hooks/useAdmin.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import type { DashboardStats } from '@/types/admin';

// Hàm gọi API
const getAdminStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/stats');
    return data; // Backend trả về { totalUsers, totalOrders... } trong data
};

// Hook React Query
export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: getAdminStats,
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        refetchOnWindowFocus: false,
    });
};