// src/hooks/useShop.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

// --- TYPES ---
export interface ShopParams {
    page?: number;
    limit?: number;
    keyword?: string;
    min_price?: number;
    max_price?: number;
    genre?: string; // "1,2,3"
    author?: string; // "1,2"
    rating?: number;
    sort?: string;
}

// --- API CALLS ---
const getPublicBooks = async (params: ShopParams) => {
    // Loại bỏ các param undefined/null/rỗng để URL sạch hơn
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );

    const { data } = await api.get('/books', { params: cleanParams });
    return data;
};

const getPublicGenres = async () => {
    const { data } = await api.get('/genres'); // API public
    return data;
};

const getPublicAuthors = async () => {
    const { data } = await api.get('/authors'); // API public
    return data;
};

// --- HOOKS ---
export const useShopBooks = (params: ShopParams) => {
    return useQuery({
        queryKey: ['shop-books', params],
        queryFn: () => getPublicBooks(params),
        keepPreviousData: true, // Giữ dữ liệu cũ khi đang load trang mới (tránh giật)
        staleTime: 1000 * 60,
    });
};

export const useShopGenres = () => useQuery({ queryKey: ['public-genres'], queryFn: getPublicGenres });
export const useShopAuthors = () => useQuery({ queryKey: ['public-authors'], queryFn: getPublicAuthors });