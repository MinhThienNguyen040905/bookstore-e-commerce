import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '@/api/orderApi';

export const useMyOrders = () => {
    return useQuery({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
        staleTime: 1000 * 60 * 5, // Cache 5 phút
    });
};