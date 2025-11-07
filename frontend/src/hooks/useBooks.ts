// src/hooks/useBooks.ts
import { useQuery } from '@tanstack/react-query';
import { getNewReleases, getTopRated } from '@/api/booksApi.ts';

// Hook cho Selected books
export const useNewReleasesBooks = () => {
    return useQuery({
        queryKey: ['getNewReleases'],  // Cache key (unique)
        queryFn: getNewReleases,   // Function gọi API
        staleTime: 5 * 60 * 1000,    // Cache 5 phút
        retry: 3,                    // Retry 3 lần nếu fail
    });
};

// Hook cho Must-buy books
export const useTopRatedBooks = () => {
    return useQuery({
        queryKey: ['getTopRated'],
        queryFn: getTopRated,
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
};

// Mở rộng sau: useBookDetail(id), useSearchBooks(query), etc.