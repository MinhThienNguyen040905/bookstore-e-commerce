import type { CardBook } from '@/types/book';
import api from './axios';


// Get selected books
export const getNewReleases = async (): Promise<CardBook[]> => {
    const response = await api.get('/books/new-releases');
    return response.data;  // Giả sử data là Book[]
};

// Get must-buy books
export const getTopRated = async (): Promise<CardBook[]> => {
    const response = await api.get('/books/top-rated');
    return response.data;
};

// Mở rộng sau: getBookById, searchBooks, etc.